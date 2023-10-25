import { For, Show, createSignal, onMount } from "solid-js"
import { GetHelp } from "#src/interface/components/GetHelp.jsx"
import { SectionLayout } from "#src/pages/index/components/sectionLayout.jsx"
import { currentPageContext } from "#src/renderer/state.js"
import Highlight from "#src/interface/components/Highlight.jsx"
import Card, { CardBuildOwn, NoResultsCard } from "#src/interface/components/Card.jsx"
import { Meta, Title } from "@solidjs/meta"
import MarketplaceLayout from "#src/interface/marketplace/MarketplaceLayout.jsx"
import SubcategoryPills from "#src/interface/marketplace/SubcategoryPills.jsx"
import * as m from "@inlang/paraglide-js/inlang-marketplace/messages"
import {
	IconFlutter,
	IconJavascript,
	IconNextjs,
	IconReact,
	IconSvelte,
	IconVue,
} from "#src/interface/custom-icons/subcategoryIcon.jsx"

type SubCategoryApplication = "app" | "library" | "plugin" | "messageLintRule"

export type Category = "application" | "markdown" | "email" | "website"
export type SubCategory = SubCategoryApplication

/* Export searchValue to make subpages insert search-terms */
export const [searchValue, setSearchValue] = createSignal<string>("")
const selectedCategory = () => {
	return currentPageContext.urlParsed.pathname.replace("/", "")
}

export function Page(props: {
	minimal?: boolean
	highlights?: Record<string, string>[]
	category?: Category | undefined
	slider?: boolean
	items: Awaited<ReturnType<any>>
}) {
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search)
		if (urlParams.get("search") !== "" && urlParams.get("search") !== undefined) {
			setSearchValue(urlParams.get("search")?.replace(/%20/g, " ") || "")
		}
	})
	const getSubCategies = [
		{
			name: "Svelte",
			param: "svelte",
			icon: <IconSvelte class="-ml-1 w-5 h-5" />,
		},
		{
			name: "React",
			param: "react",
			icon: <IconReact class="-ml-1 w-5 h-5" />,
		},
		{
			name: "Next.js",
			param: "nextjs",
			icon: <IconNextjs class="-ml-1 w-5 h-5" />,
		},
		{
			name: "Vue",
			param: "vue",
			icon: <IconVue class="-ml-1 w-5 h-5" />,
		},
		{
			name: "Javascript",
			param: "javascript",
			icon: <IconJavascript class="-ml-1 w-5 h-5" />,
		},
		{
			name: "Flutter",
			param: "flutter",
			icon: <IconFlutter class="-ml-1 w-5 h-5" />,
		},
	]

	return (
		<>
			<Title>
				Global{" "}
				{currentPageContext.routeParams.category
					?.replaceAll("-", " ")
					.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))}{" "}
				- inlang
			</Title>
			<Meta name="description" content="Globalization infrastructure for software" />
			<Meta name="og:image" content="/images/inlang-marketplace-image.jpg" />
			<MarketplaceLayout>
				<Show when={currentPageContext.routeParams.category === "application"}>
					<div class="pt-4 text-sm font-medium flex items-center gap-3 w-full overflow-x-scroll pb-4 overflow-scrollbar overflow-scrollbar-x">
						<p class="pr-4 text-surface-400">{m.footer_category_title() + ":"}</p>
						<SubcategoryPills links={getSubCategies} />
					</div>
				</Show>
				<div class="pb-16 md:pb-20 min-h-screen relative">
					<h2 class="text-md text-surface-600 pb-4 pt-8">{m.marketplace_grid_title_generic()}</h2>
					<SectionLayout showLines={false} type="white">
						<div class="relative">
							<Show when={props.highlights}>
								<Show when={props.highlights && props.highlights.length > 0}>
									<div
										class={
											"flex md:grid justify-between gap-6 md:flex-row flex-col mb-8 " +
											(props.highlights!.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1")
										}
									>
										{/* @ts-expect-error */}
										<For each={props.highlights}>{(highlight) => <Highlight {...highlight} />}</For>
									</div>
								</Show>
							</Show>

							<div class="mb-32 grid xl:grid-cols-4 md:grid-cols-2 w-full gap-4 justify-normal items-stretch relative">
								<Gallery items={props.items} />
							</div>

							<Show when={!props.category && !props.slider && !props.minimal}>
								<div class="mt-20">
									<GetHelp text="Need help or have questions? Join our Discord!" />
								</div>
							</Show>
						</div>
					</SectionLayout>
				</div>
			</MarketplaceLayout>
		</>
	)
}

const Gallery = (props: { items: any }) => {
	return (
		<>
			<Show when={props.items} fallback={<NoResultsCard category={selectedCategory()} />}>
				<For each={props.items}>
					{(item) => {
						const displayName =
							typeof item.displayName === "object" ? item.displayName.en : item.displayName

						return <Card item={item} displayName={displayName} />
					}}
				</For>
				<CardBuildOwn />
			</Show>
		</>
	)
}
