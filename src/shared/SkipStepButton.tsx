function SkipStepButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border-0 bg-[#f0e8c8] px-4 text-sm font-semibold text-[#544920] transition-colors hover:bg-[#e8dbab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
    >
      Пропустить этап
    </button>
  )
}

export default SkipStepButton
