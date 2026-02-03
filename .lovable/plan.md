
# Plan: Homepage verbeteren naar Sing-Along Bingo stijl

## Overzicht

De homepage wordt uitgebreid met meerdere content-secties die allemaal bewerkbaar zijn vanuit het admin dashboard. Dit geeft je de flexibiliteit om teksten aan te passen zonder code te wijzigen.

## Nieuwe Homepage Structuur

```text
+----------------------------------+
|           HERO SECTIE            |
|  (Logo, tagline, social links)   |
+----------------------------------+
|                                  |
|      INTRO / WAT IS HET?         |
|   (Bewerkbaar in admin)          |
|                                  |
+----------------------------------+
|                                  |
|      VOOR WIE IS HET?            |
|   (Bewerkbaar in admin)          |
|                                  |
+----------------------------------+
|                                  |
|      HOE WERKT HET?              |
|   (Bestaande 6 features)         |
|                                  |
+----------------------------------+
|                                  |
|     EERSTVOLGENDE EVENTS         |
|   (Automatisch uit database)     |
|                                  |
+----------------------------------+
|           FOOTER                 |
+----------------------------------+
```

## Wat wordt aangepast

### 1. Database uitbreiden
Nieuwe content-keys toevoegen aan `site_content` tabel:
- `homepage_intro` (bestaat al) - Hoofdintroductie
- `homepage_about` - "Wat is At The Side Bingo?" sectie
- `homepage_audience` - "Voor wie is het?" sectie

### 2. Hero sectie verbeteren
- Social media iconen toevoegen (Instagram, TikTok, etc.)
- Links bewerkbaar maken via admin (optioneel via aparte settings tabel)

### 3. Nieuwe bewerkbare secties op homepage
Twee nieuwe content secties toevoegen die elk een eigen titel en content hebben:
- **"Wat is At The Side Bingo?"** - Uitleg over het concept
- **"Voor wie is het?"** - Doelgroepen opsomming

### 4. Admin Content Editor uitbreiden
Het huidige "Content" tab in admin uitbreiden zodat je alle homepage secties kunt bewerken:
- Tabs of accordion voor elke sectie
- Dezelfde RichTextEditor hergebruiken
- Duidelijke labels per sectie

## Technische Details

### Database migratie
```sql
-- Nieuwe content rows toevoegen
INSERT INTO site_content (content_key, content_html) 
VALUES 
  ('homepage_about', '<h4>Wat is At The Side Bingo?</h4><p>Tekst hier...</p>'),
  ('homepage_audience', '<h4>Voor wie is het?</h4><p>Tekst hier...</p>');
```

### Nieuwe componenten
| Component | Doel |
|-----------|------|
| `HomepageSection.tsx` | Herbruikbare sectie die content ophaalt per `content_key` |
| `SocialLinks.tsx` | Social media iconen voor hero |

### Admin aanpassingen
| Bestand | Wijziging |
|---------|-----------|
| `ContentEditor.tsx` | Uitbreiden met tabs voor meerdere content-secties |

### Homepage aanpassingen
| Bestand | Wijziging |
|---------|-----------|
| `Index.tsx` | Nieuwe secties toevoegen tussen hero en HowItWorks |
| `HomeHero.tsx` | Social media links toevoegen |

## Resultaat
- Visueel rijkere homepage met meerdere content-blokken
- Alle teksten bewerkbaar via admin dashboard
- Geen code-wijzigingen nodig voor tekstuele updates
- Schaalbaarheid: eenvoudig nieuwe secties toevoegen in de toekomst
