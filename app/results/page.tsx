import { redirect } from 'next/navigation';

// Results belong to Edition 01 — they now live under /editions/2026/results.
export default function ResultsRedirect() {
    redirect('/editions/2026/results');
}
