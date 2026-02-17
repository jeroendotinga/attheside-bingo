import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSiteContent = (contentKey: string) => {
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

  return { content, loading };
};
