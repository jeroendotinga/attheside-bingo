import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeHtml } from '@/lib/sanitize';

const HomepageIntro = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_html')
        .eq('content_key', 'homepage_intro')
        .single();

      if (!error && data) {
        setContent(data.content_html);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  if (loading || !content) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div 
          className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 prose prose-invert max-w-none
            [&_p]:text-muted-foreground [&_p]:text-sm [&_p]:sm:text-base [&_p]:mb-4 [&_p]:last:mb-0
            [&_a]:text-neon-pink [&_a]:hover:text-neon-pink/80"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </div>
    </section>
  );
};

export default HomepageIntro;
