import {Component, HostListener} from "@angular/core";

@Component({
	selector: "navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
	showMenu = false;
	isSmallScreen = window.innerWidth <= 992;
  showLargeScreenMenu = false;
	activeSection: string | null = null;

	menuItems = [
		{label: "INICIO", link: "#home"},
		{label: "SOBRE NOSOTROS", link: "#about"},
		{label: "FOTOS", link: "#gallery"},
		{label: "ACTIVIDADES", link: "#activities"},
		{label: "SERVICIOS", link: "#services"},
		{label: "CONTACTO", link: "#contact"},
	];

	toggleMenu() {
		this.showMenu = !this.showMenu;
	}

	closeMenu() {
		this.showMenu = false;
	}

	@HostListener("window:resize", ["$event"])
	onResize(event: any) {
		this.isSmallScreen = event.target.innerWidth <= 992;
		// Hide the menu when resizing from large to small screen
		if (this.isSmallScreen) {
			this.showMenu = false;
		}
	}

	@HostListener("window:scroll", [])
	onWindowScroll() {
		// Determine the active section based on scrolling
		const sections = ["about", "gallery", "activities", "services", "contact"];
		const scrollPosition = window.scrollY;
		let activeSection: string | null = null;

		for (const section of sections) {
			const element = document.getElementById(section);
			if (element) {
				const offsetTop = element.offsetTop;
				if (scrollPosition >= offsetTop - 120) {
				activeSection = section;
				}
			}
		}

		this.activeSection = activeSection;

		// Check if the user has scrolled and remove the transparent background class
		this.showLargeScreenMenu = window.scrollY < 90 && !this.isSmallScreen;
	}

	constructor() {
		// Trigger the initial check for screen size
		this.onResize({target: {innerWidth: window.innerWidth}});
	}
}
