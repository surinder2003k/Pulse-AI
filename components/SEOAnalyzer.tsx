"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface SEOAnalyzerProps {
  title: string;
  content: string;
  seoKeywords: string; // Comma separated tags
  focusKeyword: string; // The primary target
  metaTitle: string;
  metaDescription: string;
}

interface SEOTest {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  score: number; // 0 to 10
}

export default function SEOAnalyzer({ title, content, seoKeywords, focusKeyword, metaTitle, metaDescription }: SEOAnalyzerProps) {
  const [score, setScore] = useState(0);
  const [tests, setTests] = useState<SEOTest[]>([]);

  useEffect(() => {
    if (!content) {
      setScore(0);
      setTests([]);
      return;
    }

    const newTests: SEOTest[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Helper: Strip HTML tags to get raw text length
    const rawContent = content.replace(/<[^>]*>?/gm, '');
    const wordCount = rawContent.split(/\s+/).filter(w => w.length > 0).length;

    // 1. Content Length Test (Max 20)
    maxScore += 20;
    if (wordCount > 600) {
      newTests.push({ id: "len", label: `Good word count (${wordCount} words)`, status: "pass", score: 20 });
      totalScore += 20;
    } else if (wordCount > 300) {
      newTests.push({ id: "len", label: `Word count is okay but could be longer (${wordCount} words)`, status: "warn", score: 10 });
      totalScore += 10;
    } else {
      newTests.push({ id: "len", label: `Content is too short (${wordCount} words. Aim for 300+)`, status: "fail", score: 0 });
    }

    // Keyword Analysis
    const keywords = seoKeywords.split(",").map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    
    if (keywords.length > 0) {
      // 2. Keyword in Title (Max 20)
      maxScore += 20;
      const titleLower = title.toLowerCase();
      const keywordsInTitle = keywords.filter(k => titleLower.includes(k));
      if (keywordsInTitle.length > 0) {
        newTests.push({ id: "kw_title", label: `Focus keyword found in title`, status: "pass", score: 20 });
        totalScore += 20;
      } else {
        newTests.push({ id: "kw_title", label: `Focus keyword missing from title`, status: "fail", score: 0 });
      }

      // 3. Keyword Density in Content (Max 20)
      maxScore += 20;
      const contentLower = content.toLowerCase();
      let kwCount = 0;
      keywords.forEach(kw => {
        try {
          // Escape special regex characters to prevent crash
          const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const matches = contentLower.match(new RegExp(escapedKw, 'g'));
          if (matches) kwCount += matches.length;
        } catch (e) {
          console.error("Regex error for keyword:", kw, e);
        }
      });
      
      const kwDensity = wordCount > 0 ? (kwCount / wordCount) * 100 : 0;
      if (kwDensity > 0.5 && kwDensity < 2.5) {
        newTests.push({ id: "kw_dens", label: `Great keyword density (${kwDensity.toFixed(1)}%)`, status: "pass", score: 20 });
        totalScore += 20;
      } else if (kwDensity >= 2.5) {
        newTests.push({ id: "kw_dens", label: `Keyword density might be too high (${kwDensity.toFixed(1)}%)`, status: "warn", score: 10 });
        totalScore += 10;
      } else if (kwCount > 0) {
         newTests.push({ id: "kw_dens", label: `Low keyword density, try adding more`, status: "warn", score: 10 });
         totalScore += 10;
      } else {
        newTests.push({ id: "kw_dens", label: `Focus keyword not found in content`, status: "fail", score: 0 });
      }
    } else {
       newTests.push({ id: "no_kw", label: `No focus keywords provided. Analysis limited.`, status: "warn", score: 0 });
    }

    // 4. Headings Analysis (H1, H2, H3) (Max 15)
    maxScore += 15;
    const hasH1 = content.includes('<h1');
    const hasH2 = content.includes('<h2');
    
    if (hasH1 || hasH2) {
      newTests.push({ id: "headings", label: `Good use of headings`, status: "pass", score: 15 });
      totalScore += 15;
    } else {
      newTests.push({ id: "headings", label: `No H1 or H2 headings found in content`, status: "warn", score: 0 });
    }

    // 5. Image Alt Tags Analysis (Max 15)
    maxScore += 15;
    const images = content.match(/<img[^>]+>/g) || [];
    if (images.length > 0) {
      const imagesWithAlt = images.filter(img => img.includes('alt="') && !img.includes('alt=""'));
      if (imagesWithAlt.length === images.length) {
         newTests.push({ id: "alt_tags", label: `All ${images.length} images have ALT tags`, status: "pass", score: 15 });
         totalScore += 15;
      } else {
         newTests.push({ id: "alt_tags", label: `${images.length - imagesWithAlt.length} images are missing ALT tags`, status: "warn", score: 5 });
         totalScore += 5;
      }
    } else {
       newTests.push({ id: "alt_tags", label: `No images in content. Add visuals for better engagement.`, status: "warn", score: 5 });
       totalScore += 5;
    }

    // 6. Outbound Links Analysis (Max 10)
    maxScore += 10;
    const hasLinks = content.includes('<a href=');
    if (hasLinks) {
       newTests.push({ id: "links", label: `Content contains internal/external links`, status: "pass", score: 10 });
       totalScore += 10;
    } else {
       newTests.push({ id: "links", label: `No links found. Add <a> tags for SEO authority.`, status: "warn", score: 0 });
    }

    // NEW ADVANCED TESTS
    
    // 7. Meta Title Test (Max 15)
    maxScore += 15;
    if (metaTitle) {
      const metaTitleLen = metaTitle.length;
      if (metaTitleLen >= 30 && metaTitleLen <= 60) {
        newTests.push({ id: "mt_len", label: `Meta Title length is perfect (${metaTitleLen} chars)`, status: "pass", score: 15 });
        totalScore += 15;
      } else {
        newTests.push({ id: "mt_len", label: `Meta Title length is suboptimal (${metaTitleLen} chars). Aim for 30-60.`, status: "warn", score: 5 });
        totalScore += 5;
      }
    } else {
      newTests.push({ id: "mt_len", label: `Missing Meta Title`, status: "fail", score: 0 });
    }

    // 8. Meta Description Test (Max 15)
    maxScore += 15;
    if (metaDescription) {
      const metaDesLen = metaDescription.length;
      if (metaDesLen >= 70 && metaDesLen <= 160) {
        newTests.push({ id: "md_len", label: `Meta Description length is perfect (${metaDesLen} chars)`, status: "pass", score: 15 });
        totalScore += 15;
      } else {
        newTests.push({ id: "md_len", label: `Meta Description length is suboptimal (${metaDesLen} chars). Aim for 70-160.`, status: "warn", score: 5 });
        totalScore += 5;
      }
    } else {
      newTests.push({ id: "md_len", label: `Missing Meta Description`, status: "fail", score: 0 });
    }

    // 9. Focus Keyword Tests (Max 25)
    maxScore += 25;
    if (focusKeyword) {
      const fkLower = focusKeyword.toLowerCase();
      const fkTests: string[] = [];
      
      // FK in Meta Title
      if (metaTitle.toLowerCase().includes(fkLower)) {
        fkTests.push("Meta Title");
        totalScore += 8;
      }
      
      // FK in Meta Description
      if (metaDescription.toLowerCase().includes(fkLower)) {
        fkTests.push("Meta Description");
        totalScore += 8;
      }
      
      // FK in First Paragraph
      const firstPara = rawContent.split('\n')[0].toLowerCase();
      if (firstPara.includes(fkLower)) {
        fkTests.push("First Paragraph");
        totalScore += 9;
      }

      if (fkTests.length === 3) {
        newTests.push({ id: "fk_dist", label: `Focus keyword used in Title, Desc, and Intro!`, status: "pass", score: 25 });
      } else if (fkTests.length > 0) {
        newTests.push({ id: "fk_dist", label: `Focus keyword missing from ${["Meta Title", "Meta Description", "First Paragraph"].filter(x => !fkTests.includes(x)).join(", ")}`, status: "warn", score: 10 });
      } else {
        newTests.push({ id: "fk_dist", label: `Focus keyword not found in SEO meta or intro`, status: "fail", score: 0 });
      }
    } else {
      newTests.push({ id: "fk_dist", label: `Missing Focus Keyword`, status: "fail", score: 0 });
    }

    setTests(newTests);
    setScore(Math.round((totalScore / maxScore) * 100));

  }, [title, content, seoKeywords, focusKeyword, metaTitle, metaDescription]);

  const getColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 mb-10 shadow-sm group hover:shadow-premium transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black uppercase italic tracking-tighter text-gray-900">Search Intelligence</h3>
        <div className={`text-2xl font-black italic tracking-tighter ${getTextColor()}`}>
          {score}%
        </div>
      </div>
      
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 mb-8 border border-slate-200">
        <div
          className="h-full transition-all duration-1000 ease-out rounded-full"
          style={{ 
            width: `${score}%`,
            backgroundColor: score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <div key={test.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 transition-all group/test">
            <div className="mt-0.5">
              {test.status === "pass" && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
              {test.status === "warn" && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />}
              {test.status === "fail" && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover/test:text-gray-900 transition-colors leading-relaxed italic">{test.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
