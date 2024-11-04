import { OctopusProxyServer, OctopusProxyScraper } from "@octopusproxy/server";



let scraper;
if (process.env.SCRAPER === 'true') {

  const scrapers = [
    ...(process.env.SCRAPER_WEBSHARE === 'true' ? [new OctopusProxyScraper.scraper.webshare(process.env.SCRAPER_WEBSHARE_API_TOKEN)] : [])
  ];

  if (scrapers) {
    scraper = new OctopusProxyScraper(process.env.DATABASE_URL, scrapers);
    await scraper.startScrapeLoop();
  }
}



let server;
if (process.env.SERVER) {

  server = new OctopusProxyServer(process.env.DATABASE_URL);

  await server.migrate();
  await server.start(process.env.SERVER_PORT);
}