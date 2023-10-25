import { NewsletterForm } from "#src/interface/components/NewsletterForm.jsx"
import { For } from "solid-js"
import { Button } from "./components/Button.jsx"
import IconTwitter from "~icons/cib/twitter"
import IconGithub from "~icons/cib/github"
import IconDiscord from "~icons/cib/discord"
import * as m from "@inlang/paraglide-js/inlang-marketplace/messages"
import { LanguagePicker } from "./LanguagePicker.jsx"
import Link from "#src/renderer/Link.jsx"

const Footer = () => {
	const getProductsLinks = () => {
		return [
			{
				name: m.footer_category_application(),
				href: "/application",
			},
			{
				name: m.footer_category_website(),
				href: "/website",
			},
			{
				name: m.footer_category_markdown(),
				href: "/markdown",
			},
			{
				name: m.footer_category_lint(),
				href: "/lint",
			},
		]
	}

	const socialMediaLinks = [
		{
			name: "Twitter",
			href: "https://twitter.com/inlangHQ",
			Icon: IconTwitter,
			screenreader: "Twitter Profile",
		},
		{
			name: "GitHub",
			href: "https://github.com/inlang/monorepo",
			Icon: IconGithub,
			screenreader: "GitHub Repository",
		},
		{
			name: "Discord",
			href: "https://discord.gg/gdMPPWy57R",
			Icon: IconDiscord,
			screenreader: "Discord Server",
		},
	]

	const getResourceLinks = () => {
		return [
			{
				name: m.footer_resources_roadmap(),
				href: "https://github.com/orgs/inlang/projects?query=is%3Aopen",
			},
			{
				name: m.footer_documentation_title(),
				href: "/documentation",
			},
		]
	}
	const getContactLinks = () => {
		return [
			{
				name: m.footer_contact_getInTouch(),
				href: "mailto:hello@inlang.com",
			},
			{
				name: m.footer_contact_join(),
				href: "https://github.com/inlang/monorepo/tree/main/careers",
			},
			{
				name: m.footer_contact_feedback(),
				href: "https://github.com/inlang/monorepo/discussions/categories/feedback",
			},
			{ name: m.footer_contact_blog(), href: "/blog" },
		]
	}

	return (
		<footer class="overflow-hidden max-w-7xl mx-auto">
			<div class="flex flex-row flex-wrap-reverse py-16 max-w-7xl mx-auto px-4 xl:px-0 gap-10 sm:gap-x-0 md:gap-y-10 xl:gap-0">
				<div class="w-full md:w-1/4 xl:px-4 flex flex-row items-center sm:items-start md:flex-col gap-10 md:justify-start justify-between flex-wrap">
					<div>
						<Link href="/" class="flex items-center w-fit mb-6">
							<img class="h-9 w-9" src="/favicon/safari-pinned-tab.svg" alt="Company Logo" />
							<span class="self-center pl-2 text-left font-semibold text-surface-900">inlang</span>
						</Link>
						<p class="text-surface-600 text-sm">{m.footer_inlang_tagline()}</p>
					</div>
					<div class="flex gap-7 flex-wrap">
						<For each={socialMediaLinks}>
							{(link) => (
								<Link
									target="_blank"
									class={"link link-primary flex space-x-2 items-center text-xs"}
									href={link.href}
								>
									<link.Icon class="w-5 h-5" />
									<span class="sr-only">{link.name}</span>
								</Link>
							)}
						</For>
					</div>
				</div>
				<div class="w-full sm:w-1/3 md:w-1/4 xl:px-4 flex flex-col pt-2">
					<p class="font-semibold text-surface-900 pb-3">{m.footer_resources_title()}</p>
					<For each={getResourceLinks()}>
						{(link) => (
							<div class="w-fit opacity-80">
								<Button type="text" href={link.href}>
									{link.name}
								</Button>
							</div>
						)}
					</For>
				</div>
				<div class="w-full sm:w-1/3 md:w-1/4 xl:px-4 flex flex-col pt-2">
					<p class="font-semibold text-surface-900 pb-3">{m.footer_category_title()}</p>
					<For each={getProductsLinks()}>
						{(link) => (
							<div class="w-fit opacity-80">
								<Button type="text" href={link.href}>
									{link.name}
								</Button>
							</div>
						)}
					</For>
				</div>
				<div class="w-full sm:w-1/3 md:w-1/4 xl:px-4 xl:flex flex-col pt-2">
					<p class="font-semibold text-surface-900 pb-3">{m.footer_contact_title()}</p>
					<For each={getContactLinks()}>
						{(link) => (
							<div class="w-fit opacity-80">
								<Button type="text" href={link.href}>
									{link.name}
								</Button>
							</div>
						)}
					</For>
				</div>
			</div>
			<div class="px-4 xl:px-0 flex flex-col xl:flex-row justify-between items-end gap-8 pb-16">
				<div class="xl:px-4 xl:flex flex-col gap-2 md:gap-4 pt-2 max-xl:w-full">
					<NewsletterForm />
				</div>
				<div class="xl:w-1/4 xl:px-4 flex items-center justify-between pt-2 max-xl:w-full">
					<p class="text-sm text-surface-500">
						Copyright {new Date().getFullYear().toString()} inlang
					</p>
					<LanguagePicker />
				</div>
			</div>
		</footer>
	)
}

export default Footer
