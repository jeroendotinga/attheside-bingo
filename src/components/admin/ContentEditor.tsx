import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';
import { Save, Loader2 } from 'lucide-react';

const ContentEditor = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('site_content')
      .update({ content_html: content })
      .eq('content_key', 'homepage_intro');

    setSaving(false);

    if (error) {
      toast({
        title: 'Fout bij opslaan',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Content opgeslagen!' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-neon-pink" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Homepage Intro</h2>
          <p className="text-sm text-muted-foreground">Bewerk de tekst die onder de hero op de homepage staat</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Opslaan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Opslaan
            </>
          )}
        </Button>
      </div>

      <RichTextEditor content={content} onChange={setContent} />
    </div>
  );
};

export default ContentEditor;
