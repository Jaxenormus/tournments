import { Loader2 } from "lucide-react"

export const LoadingScreen = () => {
    return (
        <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
}