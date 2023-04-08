import { Button, Card } from "example";

export default function RootPage() {
  return (
    <div>
      <h1 className="text-5xl font-bold">Template Page</h1>
      <Button />
      <Card cta="hello" title="world" href="www.google.com" />
    </div>
  );
}
