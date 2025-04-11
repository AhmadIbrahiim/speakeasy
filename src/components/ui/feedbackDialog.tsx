import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarIcon } from "lucide-react"

type FeedbackDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    // Send feedback to Google Analytics
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "voicemail_feedback",
      feedback_rating: rating,
      feedback_text: feedback,
    })

    // Set Clarity custom tags for feedback data
    window?.clarity?.("set", "feedback_rating", rating.toString())
    window?.clarity?.("set", "feedback_text", feedback)
    window?.clarity?.("event", "voicemail_feedback")

    // Close the dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 rounded-full transition-colors ${rating >= star ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400"}`}>
                <StarIcon className="w-8 h-8" />
              </button>
            ))}
          </div>
          <div className="grid gap-5">
            <Label htmlFor="feedback">How was your experience and what can we do better?</Label>
            <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share your thoughts with us..." className="h-24" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Feedback</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
