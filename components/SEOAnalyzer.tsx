"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface SEOAnalyzerProps {
  title: string;
  content: string;
  seoKeywords: string; // Comma separated
}

interface SEOTest {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  score: number; // 0 to 10
}

export default function SEOAnalyzer({ title, content, seoKeywords }: SEOAnalyzerProps) {
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
       newTests.push({ id: "links", label: `Content contains links`, status: "pass", score: 10 });
       totalScore += 10;
    } else {
       newTests.push({ id: "links", label: `No outbound/internal links found`, status: "warn", score: 0 });
    }

    setTests(newTests);
    setScore(Math.round((totalScore / maxScore) * 100));

  }, [title, content, seoKeywords]);

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
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white tracking-wide">SEO Analyzer</h3>
        <div className={`text-xl font-bold ${getTextColor()}`}>
          {score}%
        </div>
      </div>
      
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/50 mb-6">
        <div
          className="h-full transition-all duration-500 ease-in-out rounded-full"
          style={{ 
            width: `${score}%`,
            backgroundColor: score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
          }}
        />
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <div key={test.id} className="flex items-start gap-3 text-sm">
            {test.status === "pass" && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />}
            {test.status === "warn" && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />}
            {test.status === "fail" && <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
            <span className="text-white/80">{test.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
