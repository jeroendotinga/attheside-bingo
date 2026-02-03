import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface HomepageSectionProps {
  contentKey: string;
  className?: string;
}

const HomepageSection = ({ contentKey, className = '' }: HomepageSectionProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_html')
        .eq('content_key', contentKey)
        .single();

      if (!error && data) {
        setContent(data.content_html);
      }
      setLoading(false);
    };

    fetchContent();
  }, [contentKey]);

  if (loading) {
    return (
      <section className={`py-8 sm:py-12 px-4 sm:px-6 ${className}`}>
        <div className="max-w-3xl mx-auto flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <section className={`py-8 sm:py-12 px-4 sm:px-6 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div 
          className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 prose prose-invert max-w-none
            [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mb-4
            [&_h4]:text-lg [&_h4]:sm:text-xl [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mb-3
            [&_p]:text-muted-foreground [&_p]:text-sm [&_p]:sm:text-base [&_p]:mb-4 [&_p]:last:mb-0
            [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_ul]:space-y-3
            [&_li]:bg-muted/50 [&_li]:rounded-lg [&_li]:p-3 [&_li]:text-sm [&_li]:sm:text-base [&_li]:text-muted-foreground
            [&_strong]:text-foreground [&_strong]:font-semibold
            [&_a]:text-primary [&_a]:hover:text-primary/80"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
};

export default HomepageSection;
