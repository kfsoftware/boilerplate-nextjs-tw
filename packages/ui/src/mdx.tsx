import { Heading } from './components/Heading'
import { Prose } from './components/Prose'

import clsx from 'clsx'
import { Link } from 'react-router-dom'
export { CodeGroup, Code as code, Pre as pre } from './components/Code'


export function wrapper({ children }: { children: React.ReactNode }) {
	return (
		<article className="flex h-full flex-col pb-10">
			<Prose className="flex-auto">{children}</Prose>
		</article>
	)
}

export const h3 = function H3(props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>) {
	return <Heading level={3} {...props} />
}
export const h2 = function H2(props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>) {
	return <Heading level={2} {...props} />
}

function InfoIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
			<circle cx="8" cy="8" r="8" strokeWidth="0" />
			<path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 7.75h1.5v3.5" />
			<circle cx="8" cy="4" r=".5" fill="none" />
		</svg>
	)
}

function ExclamationIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
			/>
		</svg>
	)
}
export function NoteDanger({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-red-500/20 bg-red-50/50 p-4 leading-6 text-red-900 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-200 dark:[--tw-prose-links-hover:theme(colors.red.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<ExclamationIcon className="mt-1 h-4 w-4 flex-none fill-red-500 stroke-white dark:fill-red-200/20 dark:stroke-red-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
		</div>
	)
}

export function NoteWarning({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-yellow-500/20 bg-yellow-50/50 p-4 leading-6 text-yellow-900 dark:border-yellow-500/30 dark:bg-yellow-500/5 dark:text-yellow-200 dark:[--tw-prose-links:theme(colors.white)] dark:[--tw-prose-links-hover:theme(colors.yellow.300)]">
			<ExclamationIcon className="mt-1 h-4 w-4 flex-none fill-yellow-500 stroke-white dark:fill-yellow-200/20 dark:stroke-yellow-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
		</div>
	)
}
export function Note({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links:theme(colors.white)] dark:[--tw-prose-links-hover:theme(colors.emerald.300)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
		</div>
	)
}

export function Row({ children }: { children: React.ReactNode }) {
	return <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">{children}</div>
}

export function Col({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
	return <div className={clsx('[&>:first-child]:mt-0 [&>:last-child]:mb-0', sticky && 'xl:sticky xl:top-24')}>{children}</div>
}

export function Foo() {
	return <p>Bar</p>
}

export function Properties({ children }: { children: React.ReactNode }) {
	return (
		<div className="my-6">
			<ul role="list" className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5">
				{children}
			</ul>
		</div>
	)
}

export function Property({ name, children, type }: { name: string; children: React.ReactNode; type?: string }) {
	return (
		<li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
			<dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
				<dt className="sr-only">Name</dt>
				<dd>
					<code>{name}</code>
				</dd>
				{type && (
					<>
						<dt className="sr-only">Type</dt>
						<dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{type}</dd>
					</>
				)}
				<dt className="sr-only">Description</dt>
				<dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</dd>
			</dl>
		</li>
	)
}
