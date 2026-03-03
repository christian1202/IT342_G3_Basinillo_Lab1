export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight">Documents Vault</h2>
      <div className="rounded-md border p-8 text-center bg-card">
        <p className="text-muted-foreground">
          Drag and drop file upload will be rendered here...
        </p>
      </div>
    </div>
  );
}
