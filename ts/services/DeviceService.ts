// Service that provides device information
// Services are singletons

class DeviceService {

    // The only instance of the service
    private static _instance: DeviceService;
    // Device screen size
    public width: number;
    public height: number;

    private constructor() {
        // Assign the screen size
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    // Get or create the instance of the service
    public static get Instance() { return this._instance || (this._instance = new this()); }

}