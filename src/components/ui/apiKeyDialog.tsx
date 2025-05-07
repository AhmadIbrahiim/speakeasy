import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import React from "react"

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKeyInput: string
  setApiKeyInput: (val: string) => void
  apiKeyError: string
  handleSaveApiKey: () => void
  apiTab: string
  setApiTab: (tab: string) => void
}

export function ApiKeyDialog({ open, onOpenChange, apiKeyInput, setApiKeyInput, apiKeyError, handleSaveApiKey, apiTab, setApiTab }: ApiKeyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white p-8">
        <DialogHeader>
          <DialogTitle>Enter your API Key</DialogTitle>
          <DialogDescription>
            <Tabs value={apiTab} onValueChange={setApiTab} className="w-full mt-2">
              <TabsList className="mb-6 flex gap-2">
                <TabsTrigger value="cartesia">Cartesia</TabsTrigger>
                <TabsTrigger value="elevenlabs">
                  ElevenLabs <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cartesia">
                <div className="mb-6">
                  <div className="flex items-start gap-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-5 rounded-md shadow-sm">
                    <svg className="w-7 h-7 text-yellow-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" />
                    </svg>
                    <div className="flex flex-col gap-2">
                      <div className="text-xl font-semibold">Why We Need Your Help</div>
                      <div className="text-base font-normal leading-relaxed space-y-2">
                        <div>
                          We use <b>Cartesia.ai</b> to generate the voice for your greeting, then merge it with your chosen music.
                        </div>
                        <div>
                          We used to pay for this ourselves (about <b>$200/month</b>), but we simply can&apos;t afford to keep doing that for a free project.
                        </div>
                        <div>
                          As a workaround, Cartesia gives every new user <span className="font-bold text-orange-700">1,000 free credits</span> (about 20 minutes of audio) if you sign up on their site.
                          You can use these credits directly in our app.
                        </div>
                        <div>
                          <b>Cartesia is not affiliated with us</b>—we&apos;re just using their public API as a way to keep this project alive and free for everyone.
                        </div>
                        <div className="mt-3">
                          <b>Thank you for understanding and for helping keep this project running!</b>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 italic">
                          Note: Your Cartesia API key is only sent to our server for generating your audio, and is <b>never</b> saved or logged. It is not stored anywhere except your own browser.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-base text-gray-800 mb-4">
                  <b>Why do we ask?</b> Cartesia.ai powers our audio generation, but to keep things sustainable and fair, they ask each user to use their own key. <br />
                  <span className="font-semibold">We never see or store your key, and you only need to do this once.</span>
                </div>
                <div className="mt-4 mb-2 text-left">
                  <span className="font-semibold">How to get your Cartesia API key:</span>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-base text-gray-700">
                    <li>
                      <a href="https://cartesia.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Go to Cartesia.ai
                      </a>
                    </li>
                    <li>
                      <span>Sign up for a free account (no credit card required).</span>
                    </li>
                    <li>
                      <span>
                        After signing in, go to your{" "}
                        <a href="https://play.cartesia.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          API Keys Dashboard
                        </a>
                        .
                      </span>
                    </li>
                    <li>
                      <span>
                        Click <b>&quot;Create API Key&quot;</b> and give it a name (e.g., &quot;PerfectGreet&quot;).
                      </span>
                    </li>
                    <li>
                      <span>Copy your new API key and paste it below.</span>
                    </li>
                  </ol>
                </div>
                <div className="mt-4">
                  <a href="https://docs.cartesia.ai/docs/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Docs
                  </a>{" "}
                  &nbsp;|&nbsp;
                  <a href="https://cartesia.ai/blog/how-to-create-api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    How to create an API key
                  </a>
                </div>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="cartesia-api-key">Cartesia API Key</Label>
                  <Input id="cartesia-api-key" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} placeholder="Paste your Cartesia API key here" className="w-full" />
                  {apiKeyError && <div className="text-red-500 text-sm">{apiKeyError}</div>}
                  <Button onClick={handleSaveApiKey}>Save API Key</Button>
                </div>
              </TabsContent>
              <TabsContent value="elevenlabs">
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="text-lg font-semibold mb-2">ElevenLabs Support</div>
                  <div className="text-gray-500 text-base">Support for ElevenLabs API keys is coming soon!</div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
