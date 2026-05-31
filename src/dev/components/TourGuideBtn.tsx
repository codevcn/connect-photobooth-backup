export const TourGuideBtn = () => {
  const resetTourGuide = () => {
    localStorage.removeItem('has_seen_tour')
    window.location.reload()
  }

  return (
    <div onClick={resetTourGuide} className="p-2 bg-red-400 fixed top-4 right-4 z-99 select-none">
      reset tour guide
    </div>
  )
}
