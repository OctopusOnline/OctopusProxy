import { VersionInterface } from '../interface/version.interface';
import { VersionService } from '../service/version.service';
export declare class VersionController {
    private readonly versionService;
    constructor(versionService: VersionService);
    getVersion(): {
        version: VersionInterface;
    };
}
