import { NextRequest, NextResponse } from "next/server";
import { connectClient } from "@/lib/db";
import { ObjectId } from "mongodb";

const dbName = process.env.TENANT_DB_NAME;

class ValidationError extends Error {
    status: number;
    constructor(message: string, status = 400) {
        super(message);
        this.name = "ValidationError";
        this.status = status;
    }
}

function isValidDbName(name: string): boolean {
    if (!name || name.length >= 64) return false;
    // Disallow characters that are invalid/dangerous in MongoDB database names
    const invalidPattern = /[\/\\\. "*<>:|?\$]/;
    if (invalidPattern.test(name)) return false;
    
    // Disallow admin and internal system database names
    const reservedNames = ["admin", "local", "config"];
    if (reservedNames.includes(name.toLowerCase())) return false;
    
    // Only allow alphanumeric characters, hyphens, and underscores
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    return validPattern.test(name);
}

async function getDb(req: NextRequest) {
    const tenantDb = req.headers.get("x-tenant-db") || dbName || "test";
    
    if (!isValidDbName(tenantDb)) {
        throw new ValidationError("Invalid database name specified");
    }

    const client = await connectClient();
    return client.db(tenantDb);
}

function handleError(error: any, defaultMessage: string) {
    const status = error instanceof ValidationError ? error.status : 500;
    const isDev = process.env.NODE_ENV === "development";
    
    return NextResponse.json({ 
        success: false, 
        error: defaultMessage, 
        message: isDev || error instanceof ValidationError ? error.message : "An unexpected error occurred"
    }, { status });
}

// Get all comments
export async function GET(req: NextRequest) {
    try {
        const db = await getDb(req);
        const comments = await db.collection("comments").find({}).toArray();
        return NextResponse.json({ success: true, comments, pages: comments });
    } catch (error: any) {
        console.error("Error fetching comments:", error);
        return handleError(error, "Failed to fetch comments");
    }
}   

// Post comments
export async function POST(req: NextRequest) {
    try {
        const db = await getDb(req);
        const comment = await req.json();
        
        // Remove _id if it's empty to allow MongoDB to auto-generate one
        if (comment._id === "") {
            delete comment._id;
        }

        const result = await db.collection("comments").insertOne(comment);
        const addedComment = await db.collection("comments").findOne({ _id: result.insertedId });
        return NextResponse.json({ success: true, comment: addedComment });
    } catch (error: any) {
        console.error("Error creating comment:", error);
        return handleError(error, "Failed to create comment");
    }
}

// Update comments
export async function PUT(req: NextRequest) {
    try {
        const db = await getDb(req);
        const comment = await req.json();
        
        const { _id, ...updateData } = comment;
        
        if (!_id) {
            throw new ValidationError("Comment ID is required");
        }

        if (!ObjectId.isValid(_id)) {
            throw new ValidationError("Invalid Comment ID format");
        }

        const result = await db.collection("comments").updateOne(
            { _id: new ObjectId(_id) }, 
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            throw new ValidationError("Comment not found", 404);
        }

        const updatedComment = await db.collection("comments").findOne({ _id: new ObjectId(_id) });
        return NextResponse.json({ success: true, comment: updatedComment });
    } catch (error: any) {
        console.error("Error updating comment:", error);
        return handleError(error, "Failed to update comment");
    }
}

// Delete comments
export async function DELETE(req: NextRequest) {
    try {
        const db = await getDb(req);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            throw new ValidationError("Comment ID is required");
        }

        if (!ObjectId.isValid(id)) {
            throw new ValidationError("Invalid Comment ID format");
        }

        const result = await db.collection("comments").deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            throw new ValidationError("Comment not found", 404);
        }

        return NextResponse.json({ success: true, deletedId: id });
    } catch (error: any) {
        console.error("Error deleting comment:", error);
        return handleError(error, "Failed to delete comment");
    }
}

