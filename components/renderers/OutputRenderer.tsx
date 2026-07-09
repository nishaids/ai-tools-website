'use client';

import type {
  BioOutput,
  BlogTitleOutput,
  ColdEmailOutput,
  CoverLetterOutput,
  EmailOutput,
  InvoiceOutput,
  ProductDescriptionOutput,
  ResumeOutput,
  SocialCaptionOutput,
  ToolId,
  YouTubeScriptOutput,
} from '@/lib/schemas';
import ResumeRenderer from './ResumeRenderer';
import CoverLetterRenderer from './CoverLetterRenderer';
import EmailRenderer from './EmailRenderer';
import ColdEmailRenderer from './ColdEmailRenderer';
import InvoiceRenderer from './InvoiceRenderer';
import BioRenderer from './BioRenderer';
import CaptionRenderer from './CaptionRenderer';
import ProductRenderer from './ProductRenderer';
import BlogTitleRenderer from './BlogTitleRenderer';
import ScriptRenderer from './ScriptRenderer';
import FallbackRenderer from './FallbackRenderer';

export interface OutputRendererProps {
  toolId: ToolId;
  /** Validated structured output; absent when only fallbackText is available. */
  data?: unknown;
  /** Raw model text — used when JSON generation failed entirely. */
  fallbackText?: string;
  /** Section-level regenerate callback (costs one credit). */
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}

export default function OutputRenderer({
  toolId,
  data,
  fallbackText,
  onImprove,
  improvingSection,
}: OutputRendererProps) {
  if (data === undefined || data === null) {
    return <FallbackRenderer text={fallbackText || 'No output was generated. Please try again.'} />;
  }

  const improveProps = { onImprove, improvingSection };

  switch (toolId) {
    case 'resume-builder':
      return <ResumeRenderer data={data as ResumeOutput} {...improveProps} />;
    case 'cover-letter':
      return <CoverLetterRenderer data={data as CoverLetterOutput} {...improveProps} />;
    case 'email-writer':
      return <EmailRenderer data={data as EmailOutput} {...improveProps} />;
    case 'cold-email':
      return <ColdEmailRenderer data={data as ColdEmailOutput} {...improveProps} />;
    case 'invoice-generator':
      return <InvoiceRenderer data={data as InvoiceOutput} />;
    case 'bio-generator':
      return <BioRenderer data={data as BioOutput} />;
    case 'instagram-caption':
      return <CaptionRenderer data={data as SocialCaptionOutput} />;
    case 'product-description':
      return <ProductRenderer data={data as ProductDescriptionOutput} />;
    case 'blog-title':
      return <BlogTitleRenderer data={data as BlogTitleOutput} />;
    case 'youtube-script':
      return <ScriptRenderer data={data as YouTubeScriptOutput} {...improveProps} />;
    default:
      return <FallbackRenderer text={fallbackText || JSON.stringify(data, null, 2)} />;
  }
}
