import { OctopusProxyServer, OctopusProxyScraper } from "@octopusproxy/server";
import { onExitSignal, stringToBoolean, stringToInt } from "./modules/helper/helper.js";
import { Logger } from "@nestjs/common";



if (!process.env.DATABASE_URL) {
  Logger.error('DATABASE_URL is not set', 'Bootstrap');
  process.exit(1);
}



let scraper;
if (stringToBoolean(process.env.SCRAPER)) {

  const scrapers = [
    ...(stringToBoolean(process.env.SCRAPER_WEBSHARE) ? [new OctopusProxyScraper.scraper.webshare(process.env.SCRAPER_WEBSHARE_API_TOKEN)] : [])
  ];

  if (scrapers.length > 0) {
    scraper = new OctopusProxyScraper(process.env.DATABASE_URL, scrapers);
    await scraper.startScrapeLoop();

    Logger.log('Scraper started', 'Bootstrap');
  }
  else Logger.warn('No scrapers set', 'Bootstrap');
}



let server;
if (stringToBoolean(process.env.SERVER)) {

  server = new OctopusProxyServer(process.env.DATABASE_URL);

  await server.migrate();
  await server.start(stringToInt(process.env.SERVER_PORT));

  onExitSignal(async () => await server.stop());

  Logger.log('Server started', 'Bootstrap');
}



if (!scraper && !server) {
  Logger.error('No scrapers or server set', 'Bootstrap');
  process.exit(1);
}