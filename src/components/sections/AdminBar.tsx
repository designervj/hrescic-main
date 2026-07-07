"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setEditMode } from "@/lib/store/pages/pagesSlice";
import { RootState } from "@/lib/store/store";
import { useAnnotatorStore } from "@/components/annotationPlugin/store";
import { AnnotatorPlugin } from "@/components/annotationPlugin/AnnotatorPlugin";

export default function AdminBar() {
  const dispatch = useAppDispatch();

  const { isAuthenticated, authUser } = useAppSelector((state: RootState) => state.auth);
  // Real edit mode state from Redux
  const { isEditablePage } = useAppSelector((state: RootState) => state.pages);

  // Only render for non-customer authenticated users
  const isAdmin = isAuthenticated && authUser !== null && authUser?.role !== "customer";

  // Real comment mode state from AnnotatorStore
  const { isCommentModeActive, toggleCommentMode, annotations } = useAnnotatorStore();

  const [isVisible, setIsVisible] = useState(true);
  const commentCount = annotations.length;

  if (!isAdmin) return null;

  // Collapsed floating button when bar is hidden
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{ backgroundColor: "#1D2931" }}
        className="fixed top-3 right-3 z-[10000] flex items-center gap-2 px-4 h-8 border border-white/20 text-white/80 rounded-full transition-all duration-200 hover:scale-105 hover:text-white font-semibold text-[11px] shadow-lg shadow-black/40"
        title="Show Admin Bar"
      >
        <Eye className="w-3.5 h-3.5" style={{ color: "#41C717" }} />
        <span>Show Admin Bar</span>
      </button>
    );
  }

  return (
    <div
      data-annotator-ui="true"
      style={{ backgroundColor: "#1D2931" }}
      className="max-w-8xl mx-auto  text-white text-[13px] font-sans border-b border-white/10 relative z-[9999] select-none"
    >
      <div className="max-w-8xl px-4 h-11 flex items-center justify-between">

        {/* Left — Dashboard link */}
        <div className="flex items-center">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 font-bold uppercase tracking-wider text-[11px]"
          >
            <LayoutDashboard className="w-3.5 h-3.5" style={{ color: "#41C717" }} />
            <span>ADMIN DASHBOARD</span>
          </Link>
        </div>

        {/* Right — Controls */}
        <div className="flex items-center gap-3">

          {/* Comments toggle */}
          <button
            onClick={() => toggleCommentMode()}
            style={
              isCommentModeActive
                ? { borderColor: "#41C717", color: "#41C717", backgroundColor: "rgba(65,199,23,0.1)" }
                : { borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", backgroundColor: "rgba(255,255,255,0.05)" }
            }
            className="h-7 px-3 rounded-full flex items-center gap-2 transition-all border text-[11px] font-semibold hover:opacity-90"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isCommentModeActive ? "Hide Comments" : `Show Comments (${commentCount})`}</span>
          </button>

          {/* Edit Mode — connected to real Redux state */}
          <button
            onClick={() => dispatch(setEditMode(!isEditablePage))}
            style={
              isEditablePage
                ? { backgroundColor: "#41C717", borderColor: "#41C717", color: "#1D2931", boxShadow: "0 0 12px rgba(65,199,23,0.45)" }
                : { borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", backgroundColor: "rgba(255,255,255,0.05)" }
            }
            className="h-7 px-3 rounded-full flex items-center gap-1.5 transition-all text-[11px] font-semibold border hover:opacity-90"
            title={isEditablePage ? "Disable edit mode" : "Enable edit mode"}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Mode {isEditablePage ? "ON" : "OFF"}</span>
          </button>

          {/* Divider */}
          <span className="text-white/20 select-none">|</span>

          {/* Hide button */}
          <button
            onClick={() => setIsVisible(false)}
            className="h-7 w-7 rounded-full flex items-center justify-center bg-transparent text-white/70 hover:bg-white/15 hover:text-white transition-all"
            title="Hide Admin Bar"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Edit mode banner — active when isEditablePage is true */}
      {isEditablePage && (
        <div
          style={{ backgroundColor: "#41C717", color: "#1D2931" }}
          className="w-full text-center py-2 text-[12px] font-semibold border-t border-white/10"
        >
          ✨ Inline editing is active. Hover over any text block on the page and click to update.
        </div>
      )}
      
      {/* Global Annotator Plugin (only renders for admins since AdminBar is admin-only) */}
      <AnnotatorPlugin />
    </div>
  );
}
