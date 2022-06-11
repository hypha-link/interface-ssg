export default {
    projectLink: 'https://gitlab.com/hypha-link/interface', // GitHub link in the navbar
    docsRepositoryBase: 'https://gitlab.com/hypha-link/interface/pages/docs', // base URL for the docs repository
    titleSuffix: ' | Hypha',
    nextLinks: true,
    prevLinks: true,
    search: true,
    customSearch: null, // customizable, you can use algolia for example
    darkMode: true,
    font: false,
    footer: false,
    footerText: `MIT ${new Date().getFullYear()} © Hypha.`,
    footerEditLink: `Edit this page on GitLab`,
    logo: (
      <object data="/logo/hypha-01.svg" width='50' height='50'/>
    ),
    head: (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Documentation" />
        <meta name="og:title" content="Hypha" />
      </>
    ),
}