import { Loader, PlayIcon } from "lucide-react"
import { PauseIcon } from "../voicemailGreetingComponent"
import { Button } from "./button"

type Props = {
  isPlaying: boolean
  isLoading: boolean
  onClick: () => void
}
const PlayButton = ({ isPlaying, isLoading, onClick }: Props) => {
  return (
    <Button variant="destructive" onClick={onClick} disabled={isLoading} className="flex items-center justify-center py-3 px-5">
      {isLoading ? (
        <div className="animate-spin">
          <Loader size={15} />
        </div>
      ) : isPlaying ? (
        <PauseIcon size={15} />
      ) : (
        <PlayIcon size={15} />
      )}
    </Button>
  )
}

export { PlayButton }
