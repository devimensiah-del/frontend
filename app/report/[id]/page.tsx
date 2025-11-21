'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';

// Mock data - same structure as the analysis preview
const MOCK_ANALYSIS = {
  previewHtml: `
    <div style="font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.8;">
      <!-- Header -->
      <div style="text-align: center; padding: 48px 0 32px; border-bottom: 2px solid #d4af37;">
        <h1 style="font-size: 36px; font-weight: 600; color: #1a1a1a; margin: 0 0 8px;">Imensiah</h1>
        <p style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Name Analysis Report</p>
      </div>

      <!-- Client Info -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #666;">Name:</strong> Sarah Johnson</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #666;">Date of Birth:</strong> March 15, 1990</p>
        <p style="margin: 8px 0; font-size: 16px;"><strong style="color: #666;">Report Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <!-- Introduction -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Introduction</h2>
        <p style="margin: 0 0 16px; color: #333;">
          This comprehensive analysis explores the vibrational essence and energetic patterns encoded within your name.
          Through the ancient wisdom of numerology and the sacred art of name interpretation, we uncover the hidden
          forces that shape your personality, destiny, and life path.
        </p>
        <p style="margin: 0; color: #333;">
          Your name carries a unique frequency that resonates with cosmic energies, influencing your experiences,
          relationships, and personal growth journey.
        </p>
      </div>

      <!-- Core Numbers -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 24px;">Core Numerological Profile</h2>

        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; color: #1a1a1a; margin: 0 0 12px;">Life Path Number: 7</h3>
          <p style="color: #333; margin: 0 0 12px;">
            As a Life Path 7, you are a natural seeker of truth and wisdom. Your analytical mind and intuitive
            insights guide you toward deep understanding of life's mysteries. You possess a contemplative nature
            that drives you to explore both the material and spiritual realms.
          </p>
          <p style="color: #666; font-style: italic; margin: 0;">
            <strong>Key Traits:</strong> Introspective, analytical, spiritual, perfectionist, independent
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; color: #1a1a1a; margin: 0 0 12px;">Expression Number: 5</h3>
          <p style="color: #333; margin: 0 0 12px;">
            Your Expression Number reveals your natural talents and abilities. The energy of 5 brings versatility,
            adaptability, and a love for freedom. You express yourself through change, adventure, and dynamic communication.
          </p>
          <p style="color: #666; font-style: italic; margin: 0;">
            <strong>Strengths:</strong> Adaptable, energetic, curious, persuasive, progressive
          </p>
        </div>

        <div style="margin-bottom: 0;">
          <h3 style="font-size: 18px; color: #1a1a1a; margin: 0 0 12px;">Soul Urge Number: 3</h3>
          <p style="color: #333; margin: 0 0 12px;">
            Your Soul Urge Number represents your innermost desires and motivations. The vibration of 3 indicates
            a deep need for creative self-expression, social connection, and joyful communication. You are driven
            by the desire to inspire and uplift others.
          </p>
          <p style="color: #666; font-style: italic; margin: 0;">
            <strong>Inner Desires:</strong> Creative expression, social harmony, optimism, artistic pursuits
          </p>
        </div>
      </div>

      <!-- Personality Analysis -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Personality & Character Insights</h2>
        <p style="color: #333; margin: 0 0 16px;">
          The combination of your Life Path 7 and Expression 5 creates a fascinating duality in your personality.
          While you possess a deep, introspective nature that seeks wisdom and understanding, you also have a
          dynamic, adventurous spirit that craves new experiences and freedom.
        </p>
        <p style="color: #333; margin: 0 0 16px;">
          This blend manifests as someone who can be both a contemplative philosopher and an enthusiastic explorer.
          You may find yourself drawn to intellectual pursuits that also involve travel, cultural exploration, or
          innovative thinking. Your Soul Urge 3 adds a creative and social dimension, suggesting that you share
          your discoveries and insights in creative, engaging ways.
        </p>
        <p style="color: #333; margin: 0;">
          <strong style="color: #1a1a1a;">Challenge to Embrace:</strong> Balancing your need for solitude and
          reflection with your desire for social interaction and new experiences. Learning to integrate your
          introspective wisdom with your dynamic expression will unlock your fullest potential.
        </p>
      </div>

      <!-- Destiny & Life Purpose -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Destiny & Life Purpose</h2>
        <p style="color: #333; margin: 0 0 16px;">
          Your numerological blueprint suggests a life path centered around the pursuit and sharing of knowledge.
          You are here to explore the deeper meaning of existence, to question conventional wisdom, and to
          communicate your unique insights in ways that inspire others to think differently.
        </p>
        <p style="color: #333; margin: 0 0 16px;">
          Your destiny involves bridging the gap between the known and the unknown, the material and the spiritual.
          Whether through teaching, writing, research, or creative expression, you are meant to illuminate truths
          that others may overlook.
        </p>
        <p style="color: #333; margin: 0;">
          <strong style="color: #1a1a1a;">Potential Career Paths:</strong> Research, philosophy, teaching, writing,
          spiritual guidance, psychology, innovation consulting, cultural anthropology, or any field that combines
          analytical thinking with creative communication.
        </p>
      </div>

      <!-- Relationships & Compatibility -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Relationships & Compatibility</h2>
        <p style="color: #333; margin: 0 0 16px;">
          In relationships, you seek partners who can appreciate both your need for independence and your desire
          for meaningful connection. You are most compatible with individuals who respect your introspective nature
          while also encouraging your adventurous spirit.
        </p>
        <p style="color: #333; margin: 0 0 16px;">
          <strong style="color: #1a1a1a;">Most Compatible With:</strong> Life Paths 3, 5, and 9 - These numbers
          complement your energy, offering either creative partnership, shared love of freedom, or spiritual depth.
        </p>
        <p style="color: #333; margin: 0;">
          <strong style="color: #1a1a1a;">Relationship Advice:</strong> Communicate your need for alone time clearly,
          and seek partners who have their own passions and interests. Ideal relationships for you provide both
          intellectual stimulation and emotional freedom.
        </p>
      </div>

      <!-- Challenges & Growth -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Challenges & Opportunities for Growth</h2>
        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 16px; color: #1a1a1a; margin: 0 0 8px;">Potential Challenges:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            <li style="margin-bottom: 8px;">Tendency toward isolation or becoming too withdrawn</li>
            <li style="margin-bottom: 8px;">Difficulty making decisions due to over-analysis</li>
            <li style="margin-bottom: 8px;">Restlessness when confined to routine or structure</li>
            <li style="margin-bottom: 0;">Impatience with those who don't share your intellectual depth</li>
          </ul>
        </div>
        <div>
          <h3 style="font-size: 16px; color: #1a1a1a; margin: 0 0 8px;">Growth Opportunities:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            <li style="margin-bottom: 8px;">Develop trust in your intuition alongside your analytical abilities</li>
            <li style="margin-bottom: 8px;">Practice grounding techniques to balance your exploratory energy</li>
            <li style="margin-bottom: 8px;">Share your wisdom more freely, even when it feels incomplete</li>
            <li style="margin-bottom: 0;">Cultivate patience and compassion for different learning styles</li>
          </ul>
        </div>
      </div>

      <!-- Current Year Forecast -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Personal Year Number: 6</h2>
        <p style="color: #333; margin: 0 0 16px;">
          You are currently in a Personal Year 6, which emphasizes themes of responsibility, service, and harmony.
          This is a year focused on relationships, home, and community. You may find yourself taking on more
          responsibilities in your personal life or feeling called to nurture and support others.
        </p>
        <p style="color: #333; margin: 0 0 16px;">
          <strong style="color: #1a1a1a;">Key Themes for This Year:</strong> Family matters, domestic improvements,
          healing relationships, service to others, finding balance between personal needs and obligations.
        </p>
        <p style="color: #333; margin: 0;">
          <strong style="color: #1a1a1a;">Advice:</strong> While you may feel pulled toward taking care of others,
          remember to maintain your own need for independence and personal growth. This year offers opportunities
          to deepen connections while staying true to your authentic self.
        </p>
      </div>

      <!-- Spiritual Insights -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Spiritual Insights & Guidance</h2>
        <p style="color: #333; margin: 0 0 16px;">
          Your name carries the vibration of a spiritual seeker and truth-finder. You are on a journey to
          understand the mysteries of existence, and your path is one of continuous learning and evolution.
          Trust that your questioning nature is not a weakness but a sacred gift.
        </p>
        <p style="color: #333; margin: 0 0 16px;">
          The universe speaks to you through patterns, synchronicities, and moments of deep insight. Pay attention
          to your dreams, intuitive hunches, and the wisdom that emerges during quiet contemplation. Your spiritual
          practice benefits from both solitary reflection and diverse experiences.
        </p>
        <p style="color: #333; margin: 0;">
          <strong style="color: #1a1a1a;">Recommended Practices:</strong> Meditation, journaling, nature walks,
          studying philosophy or metaphysics, travel to sacred sites, or any practice that combines intellectual
          exploration with spiritual development.
        </p>
      </div>

      <!-- Affirmations -->
      <div style="padding: 32px 0; border-bottom: 1px solid #e5e5e5;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Personal Affirmations</h2>
        <p style="color: #333; margin: 0 0 16px;">These affirmations are specifically aligned with your numerological profile:</p>
        <ul style="margin: 0; padding-left: 20px; color: #333; list-style: none;">
          <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; color: #d4af37;">✦</span>
            I trust my inner wisdom and intuitive knowing.
          </li>
          <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; color: #d4af37;">✦</span>
            I embrace change and new experiences with an open heart.
          </li>
          <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; color: #d4af37;">✦</span>
            I express my unique insights with confidence and creativity.
          </li>
          <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; color: #d4af37;">✦</span>
            I balance solitude with connection, honoring both needs.
          </li>
          <li style="margin-bottom: 0; padding-left: 24px; position: relative;">
            <span style="position: absolute; left: 0; color: #d4af37;">✦</span>
            I am a bridge between wisdom and wonder, depth and delight.
          </li>
        </ul>
      </div>

      <!-- Conclusion -->
      <div style="padding: 32px 0;">
        <h2 style="font-size: 24px; color: #d4af37; margin: 0 0 16px;">Closing Thoughts</h2>
        <p style="color: #333; margin: 0 0 16px;">
          Your name is more than a label—it is a key to understanding the unique energetic blueprint you carry
          through this lifetime. The numbers and patterns revealed in this analysis offer guidance, but remember
          that you are the ultimate authority on your own journey.
        </p>
        <p style="color: #333; margin: 0 0 16px;">
          Use this information as a compass, not a constraint. Let it illuminate your strengths, clarify your
          challenges, and inspire you to live more authentically. Your greatest gift to the world is being fully,
          unapologetically yourself.
        </p>
        <p style="color: #333; margin: 0;">
          May this analysis serve you well on your path of self-discovery and personal evolution.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 32px 0 0; border-top: 2px solid #d4af37; margin-top: 32px;">
        <p style="font-size: 14px; color: #666; margin: 0 0 8px;">
          Prepared with care by <strong style="color: #1a1a1a;">Imensiah</strong>
        </p>
        <p style="font-size: 12px; color: #999; margin: 0;">
          For questions or guidance, please contact us through our website.
        </p>
      </div>
    </div>
  `,
};

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Simulate loading the report
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // TODO: Implement actual PDF download
      // const response = await fetch(`/api/reports/${reportId}/pdf`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `imensiah-report-${reportId}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('PDF download triggered for report:', reportId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Download Button - Fixed Position */}
      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="fixed top-8 right-8 z-50 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Preparing PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </>
        )}
      </button>

      {/* Document Container */}
      <div className="max-w-4xl mx-auto">
        {/* A4 Document */}
        <div
          className="bg-white shadow-2xl rounded-sm overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Report Content */}
          <div
            className="p-12 sm:p-16"
            dangerouslySetInnerHTML={{ __html: MOCK_ANALYSIS.previewHtml }}
          />
        </div>

        {/* Subtle Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>This report is confidential and prepared exclusively for you.</p>
          <p className="mt-2">© {new Date().getFullYear()} Imensiah. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
