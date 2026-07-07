'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Annotation, useAnnotatorStore } from './store';
import { getCssSelector, getScreenSize } from './utils';
import { Marker } from './Marker';

import { createCommentThunk } from '@/lib/store/comments/commentThunk';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

import { SUPPORTED_LOCALES } from '@/lib/i18n';
import GetAllCommments from './GetAllCommments';
import { usePathname } from 'next/navigation';
import { RootState } from '@/lib/store/store';
import { useAppDispatch } from '@/lib/store/hooks';
import { setPageComments } from '@/lib/store/comments/commentSlice';
// import { setPageComments } from '@/lib/store/comments/commentSlice';

export const AnnotatorPlugin: React.FC = () => {
  const {
    annotations,
    isCommentModeActive,
    addAnnotation,
    removeAnnotation,
    setActiveAnnotationId,
    settings,
    setAnnotations
  } = useAnnotatorStore();
  const pagesState = useSelector((state: RootState) => state.pages);
  const currentPages = pagesState?.currentPages;
  const [draft, setDraft] = useState<{
    x: number;
    y: number;
    selector: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [draftContent, setDraftContent] = useState('');
  const commentsState = useSelector((state: RootState) => state.comments);
  const allComments = commentsState?.allComments || [];
  const dispatch = useAppDispatch()

  const pathname = usePathname()
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];
  const hasLocalePrefix = SUPPORTED_LOCALES.includes(segments[0]);
  const pathSegments = hasLocalePrefix ? segments.slice(1) : segments;
  const slug = pathSegments.join('/') || "home";

  // update the annotation
  useEffect(() => {
    if (slug && Array.isArray(allComments)) {
      const filterComments = allComments.filter((comment: Annotation) => comment.slug === slug)
      dispatch(setPageComments(filterComments))
      setAnnotations(filterComments)
    }
  }, [slug, allComments, dispatch, setAnnotations])

  // Apply calibration mode styles
  useEffect(() => {
    if (settings.calibrationMode && isCommentModeActive) {
      document.body.classList.add('annotator-calibration-mode');
    } else {
      document.body.classList.remove('annotator-calibration-mode');
    }

    return () => {
      document.body.classList.remove('annotator-calibration-mode');
    };
  }, [settings.calibrationMode, isCommentModeActive]);

  // Handle clicking on the document to create an annotation
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isCommentModeActive) return;

    e.preventDefault();
    e.stopPropagation();

    // 1. Temporarily hide the capture overlay so we can find the real element underneath
    const overlay = e.currentTarget as HTMLElement;
    overlay.style.display = 'none';

    // 2. Find the actual target element
    const target = document.elementFromPoint(e.clientX, e.clientY);

    // 3. Restore the overlay
    overlay.style.display = 'block';

    if (!target || target === document.body || target === document.documentElement) {
      if (!target) return;
    }

    if (target instanceof Element && target.closest('[data-annotator-ui="true"]')) {
      return;
    }

    // 4. Calculate relative percentages
    const rect = target.getBoundingClientRect();
    const offsetX = ((e.clientX - rect.left) / rect.width) * 100;
    const offsetY = ((e.clientY - rect.top) / rect.height) * 100;

    // 5. Generate robust selector
    const selector = getCssSelector(target);

    setDraft({
      x: e.clientX,
      y: e.clientY,
      selector,
      offsetX,
      offsetY
    });
  };

  // Close active annotation if clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!isCommentModeActive && !draft) {
        setActiveAnnotationId(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isCommentModeActive, draft, setActiveAnnotationId]);

  const handleSaveDraft = async () => {
    if (!draft || !draftContent.trim()) return;
    const commentId = Math.random().toString(36).substring(2, 9);
    const commentCreatedAt = Date.now();
    const data: Annotation = {
      id: commentId,
      selector: draft.selector,
      offsetX: draft.offsetX,
      offsetY: draft.offsetY,
      content: draftContent.trim(),
      status: 'open',
      screenSize: getScreenSize(window.innerWidth),
      pageId: currentPages?._id || "",
      slug: slug,
      createdAt: commentCreatedAt
    }
    
    // Add locally for optimistic update
    addAnnotation(data);
    setDraft(null);
    setDraftContent('');

    // add comment into Db with error handling
    try {
      const response = await dispatch(createCommentThunk(data)).unwrap()
      if (response?.success) {
        toast.success("Comment added successfully")
      } else {
        toast.error("Failed to add comment")
        removeAnnotation(commentId);
      }
    } catch (error: any) {
      console.error("Error creating comment:", error);
      toast.error(error || "Failed to add comment")
      removeAnnotation(commentId);
    }
  };

  const handleCancelDraft = () => {
    setDraft(null);
    setDraftContent('');
  };

  return (
    <>
      {/* get all comments */}
      <GetAllCommments />
      
      {/* Only render markers and capture layer if Comment Mode is ACTIVE */}
      {isCommentModeActive && (
        <>
          {/* Invisible overlay to capture clicks when in annotation mode */}
          {!draft && (
            <div
              data-annotator-ui="true"
              className="fixed inset-x-0 bottom-0 top-[44px] z-[9998] cursor-crosshair"
              onClickCapture={handleCanvasClick}
            >
              {/* Subtle border to indicate mode is active */}
              <div className="absolute inset-0 border-4 border-indigo-500/30 pointer-events-none" />
            </div>
          )}

          {/* Render existing markers */}
          {annotations.map((annotation: Annotation) => (
            <Marker key={annotation._id ?? annotation.id} annotation={annotation} />
          ))}

          {/* Draft Annotation Popover */}
          {draft && (
            <div
              data-annotator-ui="true"
              className="fixed z-[10000] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${draft.x}px`, top: `${draft.y}px` }}
            >
              {/* Draft Pin (Red for 'Open' default) */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full shadow-lg ring-4 ring-red-200 flex items-center justify-center text-white">
                <MessageSquarePlus size={16} />
              </div>

              {/* Draft Input Dialog */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-4">
                  <textarea
                    autoFocus
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Type your comment here..."
                    className="w-full h-24 text-sm text-slate-800 placeholder-slate-400 border-none focus:ring-0 resize-none outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveDraft();
                      }
                      if (e.key === 'Escape') {
                        handleCancelDraft();
                      }
                    }}
                  />
                </div>
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={handleCancelDraft}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={!draftContent.trim()}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
