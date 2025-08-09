function SpinnerLoading(){
    return (
        <div className="flex h-full items-center justify-center">
            <div className="size-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default SpinnerLoading;