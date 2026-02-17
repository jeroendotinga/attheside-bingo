import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2 } from 'lucide-react';

interface ContentSection {
  key: string;
  label: string;
  description: string;
}

const CONTENT_SECTIONS: ContentSection[] = [
  {
    key: 'homepage_intro',
    label: 'Intro',
    description: 'Eerste tekst onder de hero sectie',
  },
  {
    key: 'homepage_what',
    label: 'Wat is het?',
    description: 'Subtekst bij "Wat is de Grote Bingo Sing a Long Show"',
  },
  {
    key: 'homepage_about',
    label: 'Over ons',
    description: 'Uitleg over De Grote Bingo Sing a Long Show',
  },
  {
    key: 'homepage_forwho',
    label: 'Voor wie?',
    description: 'Subtekst bij "Voor wie is het?"',
  },
  {
    key: 'homepage_audience',
    label: 'Doelgroep',
    description: 'Doelgroepen en wie er welkom is',
  },
  {
    key: 'homepage_howitworks',
    label: 'Zo werkt het',
    description: 'Subtekst bij "Zo werkt het"',
  },
  {
    key: 'homepage_whyus',
    label: 'Waarom wij?',
    description: 'Subtekst bij "Waarom De Grote Bingo Sing a Long Show"',
  },
  {
    key: 'homepage_reviews',
    label: 'Reviews',
    description: 'Subtekst bij de reviews sectie',
  },
  {
    key: 'homepage_contact',
    label: 'Contact',
    description: 'Subtekst bij het contactformulier',
  },
];

const ContentEditor = () => {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(CONTENT_SECTIONS[0].key);

  useEffect(() => {
    const fetchAllContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_key, content_html')
        .in('content_key', CONTENT_SECTIONS.map(s => s.key));

      if (!error && data) {
        const contentMap: Record<string, string> = {};
        data.forEach(item => {
          contentMap[item.content_key] = item.content_html;
        });
        setContents(contentMap);
      }
      setLoading(false);
    };

    fetchAllContent();
  }, []);

  const handleSave = async (contentKey: string) => {
    setSaving(contentKey);
    
    const { error } = await supabase
      .from('site_content')
      .upsert(
        { content_key: contentKey, content_html: contents[contentKey] || '' },
        { onConflict: 'content_key' }
      );

    setSaving(null);

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

  const updateContent = (key: string, value: string) => {
    setContents(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Homepage Content</h2>
        <p className="text-sm text-muted-foreground">Bewerk de teksten op de homepage</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          {CONTENT_SECTIONS.map(section => (
            <TabsTrigger key={section.key} value={section.key}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CONTENT_SECTIONS.map(section => (
          <TabsContent key={section.key} value={section.key} className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <Button 
                onClick={() => handleSave(section.key)} 
                disabled={saving === section.key}
                className="bg-primary"
              >
                {saving === section.key ? (
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
            <RichTextEditor 
              content={contents[section.key] || ''} 
              onChange={(value) => updateContent(section.key, value)} 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentEditor;
