const NoAccessPage = () => {
  return (
    <div className="h-screen mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            You do not have access to this resource
          </h1>
          <p className="text-md text-muted-foreground">
            You do not have access to this resource. This could be due to an
            outdated session, which can be resolved by refreshing the page or
            your whop subscription may have expired.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoAccessPage;
