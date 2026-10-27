import { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { CopyIcon, RefreshIcon, FileTextIcon, DownloadIcon } from './components/icons';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { generateLoremIpsum, type Language, type TextType } from './utils/loremGenerator';

function App() {
  const [config, setConfig] = useState({
    language: 'ko' as Language,
    textType: 'prose' as TextType,
    paragraphs: 3,
    minSentencesPerParagraph: 3,
    maxSentencesPerParagraph: 6,
    minWordsPerSentence: 5,
    maxWordsPerSentence: 15,
    characterCount: 0
  });
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    try {
      const text = generateLoremIpsum({
        language: config.language,
        textType: config.textType,
        paragraphs: config.paragraphs,
        minSentencesPerParagraph: config.minSentencesPerParagraph,
        maxSentencesPerParagraph: config.maxSentencesPerParagraph,
        minWordsPerSentence: config.minWordsPerSentence,
        maxWordsPerSentence: config.maxWordsPerSentence,
        characterCount: config.characterCount > 0 ? config.characterCount : undefined
      });
      setGeneratedText(text);
      toast.success('텍스트가 생성되었습니다!');
    } catch (error) {
      toast.error('텍스트 생성에 실패했습니다');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  const handleCopy = useCallback(async () => {
    if (!generatedText) {
      toast.error('생성된 텍스트가 없습니다');
      return;
    }

    try {
      // Use modern Clipboard API with fallback
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedText);
        toast.success('클립보드에 복사되었습니다!');
      } else {
        // Fallback for older browsers
        if (!textareaRef.current) {
          toast.error('복사에 실패했습니다');
          return;
        }
        textareaRef.current.select();
        textareaRef.current.setSelectionRange(0, generatedText.length);
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success('클립보드에 복사되었습니다!');
          window.getSelection()?.removeAllRanges();
        } else {
          toast.error('복사에 실패했습니다');
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('복사에 실패했습니다');
    }
  }, [generatedText]);

  const handleDownload = useCallback(() => {
    if (!generatedText) {
      toast.error('생성된 텍스트가 없습니다');
      return;
    }

    try {
      // Create blob from text
      const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with timestamp and random hash
      const now = new Date();
      const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');

      // Generate random 8-character hash
      const randomHash = Math.random().toString(36).substring(2, 10).padEnd(8, '0');

      link.download = `multilingual-text_${config.language}_${randomHash}_${timestamp}.txt`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('파일이 다운로드되었습니다!');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('다운로드에 실패했습니다');
    }
  }, [generatedText, config.language]);

  // Memoized slider handlers
  const sliderHandlers = useMemo(() => ({
    setParagraphs: (value: number[]) =>
      setConfig(prev => ({ ...prev, paragraphs: value[0] })),

    setMinSentences: (value: number[]) => {
      const newMin = value[0];
      setConfig(prev => ({
        ...prev,
        minSentencesPerParagraph: newMin,
        maxSentencesPerParagraph: Math.max(newMin, prev.maxSentencesPerParagraph)
      }));
    },

    setMaxSentences: (value: number[]) => {
      const newMax = value[0];
      setConfig(prev => ({
        ...prev,
        maxSentencesPerParagraph: newMax,
        minSentencesPerParagraph: Math.min(newMax, prev.minSentencesPerParagraph)
      }));
    },

    setMinWords: (value: number[]) => {
      const newMin = value[0];
      setConfig(prev => ({
        ...prev,
        minWordsPerSentence: newMin,
        maxWordsPerSentence: Math.max(newMin, prev.maxWordsPerSentence)
      }));
    },

    setMaxWords: (value: number[]) => {
      const newMax = value[0];
      setConfig(prev => ({
        ...prev,
        maxWordsPerSentence: newMax,
        minWordsPerSentence: Math.min(newMax, prev.minWordsPerSentence)
      }));
    },

    setCharacterCount: (value: number[]) =>
      setConfig(prev => ({ ...prev, characterCount: value[0] }))
  }), []);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <FileTextIcon className="w-8 h-8 flex-shrink-0" />
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">다국어 로렘 입숨 생성기</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">11개 언어로 만드는 레이아웃용 텍스트</p>
              </div>
            </div>
            <div className="text-muted-foreground text-xs sm:text-sm mt-2 px-2 space-y-1">
              <p>한국어 · 영어 · 스페인어 · 프랑스어 · 독일어 · 라틴어</p>
              <p>러시아어 · 일본어 · 중국어 · 베트남어 · 태국어</p>
              <p>중립 어휘를 무작위로 조합합니다. 자연스러운 번역이나 문장을 만들지 않으며 긴 결과에는 반복이 생길 수 있습니다.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Settings Panel */}
          <aside>
            <Card>
              <CardHeader>
                <CardTitle>생성 설정</CardTitle>
                <CardDescription>
                  원하는 텍스트 스타일과 길이를 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-2">
                  <Label>생성 언어</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                    <Button
                      variant={config.language === 'ko' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'ko'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'ko' }))}
                      className="w-full"
                    >
                      한국어
                    </Button>
                    <Button
                      variant={config.language === 'en' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'en'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'en' }))}
                      className="w-full"
                    >
                      영어
                    </Button>
                    <Button
                      variant={config.language === 'es' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'es'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'es' }))}
                      className="w-full"
                    >
                      스페인어
                    </Button>
                    <Button
                      variant={config.language === 'fr' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'fr'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'fr' }))}
                      className="w-full"
                    >
                      프랑스어
                    </Button>
                    <Button
                      variant={config.language === 'de' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'de'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'de' }))}
                      className="w-full"
                    >
                      독일어
                    </Button>
                    <Button
                      variant={config.language === 'la' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'la'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'la' }))}
                      className="w-full"
                    >
                      라틴어
                    </Button>
                    <Button
                      variant={config.language === 'ru' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'ru'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'ru' }))}
                      className="w-full"
                    >
                      러시아어
                    </Button>
                    <Button
                      variant={config.language === 'ja' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'ja'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'ja' }))}
                      className="w-full"
                    >
                      일본어
                    </Button>
                    <Button
                      variant={config.language === 'zh' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'zh'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'zh' }))}
                      className="w-full"
                    >
                      중국어
                    </Button>
                    <Button
                      variant={config.language === 'vi' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'vi'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'vi' }))}
                      className="w-full"
                    >
                      베트남어
                    </Button>
                    <Button
                      variant={config.language === 'th' ? 'default' : 'outline'}
                      aria-pressed={config.language === 'th'}
                      onClick={() => setConfig(prev => ({ ...prev, language: 'th' }))}
                      className="w-full"
                    >
                      태국어
                    </Button>
                  </div>
                </div>

                {/* Text Type Selection */}
                <div className="space-y-2">
                  <Label>글의 형태</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant={config.textType === 'prose' ? 'default' : 'outline'}
                      aria-pressed={config.textType === 'prose'}
                      onClick={() => setConfig(prev => ({ ...prev, textType: 'prose' }))}
                      className="w-full"
                    >
                      산문
                    </Button>
                    <Button
                      variant={config.textType === 'poetry' ? 'default' : 'outline'}
                      aria-pressed={config.textType === 'poetry'}
                      onClick={() => setConfig(prev => ({ ...prev, textType: 'poetry' }))}
                      className="w-full"
                    >
                      시
                    </Button>
                    <Button
                      variant={config.textType === 'copy' ? 'default' : 'outline'}
                      aria-pressed={config.textType === 'copy'}
                      onClick={() => setConfig(prev => ({ ...prev, textType: 'copy' }))}
                      className="w-full"
                    >
                      카피
                    </Button>
                    <Button
                      variant={config.textType === 'lead' ? 'default' : 'outline'}
                      aria-pressed={config.textType === 'lead'}
                      onClick={() => setConfig(prev => ({ ...prev, textType: 'lead' }))}
                      className="w-full"
                    >
                      리드
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Paragraphs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{config.textType === 'poetry' ? '연(stanza) 수' : '문단 수'}</Label>
                    <span className="text-sm tabular-nums">{config.paragraphs}</span>
                  </div>
                  <Slider
                    aria-label="문단 또는 연 수"
                    value={[config.paragraphs]}
                    onValueChange={sliderHandlers.setParagraphs}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                {/* Sentences per Paragraph */}
                {config.textType !== 'poetry' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>문단당 문장 수</Label>
                      <span className="text-sm tabular-nums">
                        {config.minSentencesPerParagraph} - {config.maxSentencesPerParagraph}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">최소</span>
                        <Slider
                    aria-label="문단당 최소 문장 수"
                          value={[config.minSentencesPerParagraph]}
                          onValueChange={sliderHandlers.setMinSentences}
                          min={1}
                          max={15}
                          step={1}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">최대</span>
                        <Slider
                    aria-label="문단당 최대 문장 수"
                          value={[config.maxSentencesPerParagraph]}
                          onValueChange={sliderHandlers.setMaxSentences}
                          min={1}
                          max={15}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Words per Sentence/Line */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{config.textType === 'poetry' ? '행당 단어 수' : '문장당 단어 수'}</Label>
                    <span className="text-sm tabular-nums">
                      {config.minWordsPerSentence} - {config.maxWordsPerSentence}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8">최소</span>
                      <Slider
                    aria-label="문장 또는 행당 최소 단어 수"
                        value={[config.minWordsPerSentence]}
                        onValueChange={sliderHandlers.setMinWords}
                        min={3}
                        max={30}
                        step={1}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8">최대</span>
                      <Slider
                    aria-label="문장 또는 행당 최대 단어 수"
                        value={[config.maxWordsPerSentence]}
                        onValueChange={sliderHandlers.setMaxWords}
                        min={3}
                        max={30}
                        step={1}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Character Count Limit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>글자 수 제한 (선택)</Label>
                    <span className="text-sm tabular-nums">
                      {config.characterCount === 0 ? '제한 없음' : `${config.characterCount}자`}
                    </span>
                  </div>
                  <Slider
                    aria-label="글자 수 제한"
                    value={[config.characterCount]}
                    onValueChange={sliderHandlers.setCharacterCount}
                    min={0}
                    max={5000}
                    step={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    0으로 설정하면 글자 수 제한이 없습니다
                  </p>
                </div>

                <Separator />

                {/* Generate Button */}
                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={isGenerating}>
                  <RefreshIcon className="w-4 h-4 mr-2" />
                  {isGenerating ? '생성 중...' : '텍스트 생성'}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Output Panel */}
          <section>
            <Card className="h-full">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="whitespace-nowrap">생성된 텍스트</CardTitle>
                    <CardDescription>
                      {generatedText && (
                        <span className="tabular-nums">
                          {generatedText.length.toLocaleString()}자
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      disabled={!generatedText}
                    >
                      <CopyIcon className="w-4 h-4 mr-2" />
                      복사
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      disabled={!generatedText}
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {generatedText ? (
                  <Textarea
                    value={generatedText}
                    readOnly
                    className="min-h-[600px] font-mono text-sm resize-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                    aria-label="생성된 텍스트"
                    ref={textareaRef}
                  />
                ) : (
                  <div className="min-h-[600px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <FileTextIcon className="w-16 h-16 mx-auto opacity-20" />
                      <p>왼쪽 패널에서 설정을 선택하고</p>
                      <p>"텍스트 생성" 버튼을 클릭하세요</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

    </div>
  );
}

export default App;