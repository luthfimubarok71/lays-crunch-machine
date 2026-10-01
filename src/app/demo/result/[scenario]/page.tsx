import { notFound } from "next/navigation";
import { SCENARIOS, isScenario } from "@/domain/demo";
import { ResultPage } from "@/features/delivery/result-page";
export function generateStaticParams() {
  return Object.keys(SCENARIOS).map((scenario) => ({ scenario }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  if (!isScenario(scenario)) notFound();
  return <ResultPage scenarioId={scenario} />;
}
