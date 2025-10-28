# AI Rules for Cubezila Application

This document outlines the technical stack and guidelines for using libraries within the Cubezila application.

## Tech Stack Description

*   **HTML5**: Used for structuring all web pages and content.
*   **CSS3**: Custom stylesheets (`algs.css`, `roots.css`, `mobile.css`, `alg-dash.css`, `zbll.css`) are used for all styling and responsive design.
*   **Vanilla JavaScript**: All interactive elements, dynamic content, and client-side logic are implemented using plain JavaScript.
*   **`sr-puzzlegen`**: A dedicated JavaScript library for generating and rendering 2D/3D cube puzzle images and scrambles.
*   **Font Awesome**: Integrated for scalable vector icons across the application.
*   **Google Fonts**: Custom fonts (`Parkinsans`, `Zain`) are imported for typography.
*   **Browser Local Storage**: Utilized via `storage.js` for client-side data persistence, such as user progress, solve history, and settings.
*   **No Frameworks**: The application currently operates without any front-end frameworks (e.g., React, Angular, Vue) or build tools.

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following rules when making changes or adding new features:

*   **Core Development**: All new features and modifications should be implemented using standard HTML, CSS, and vanilla JavaScript.
*   **Styling**: Utilize the existing custom CSS files for all styling. Avoid inline styles where possible, and ensure new styles are integrated logically into the existing stylesheets.
*   **Cube Visualizations**: For any functionality involving the display of cube cases, scrambles, or puzzle diagrams, **always use the `sr-puzzlegen` library**.
*   **Icons**: For all icon needs, use **Font Awesome**.
*   **Client-Side Data Storage**: When persisting user-specific data (e.g., learned algorithms, solve times, selected cases, color schemes), use the `storage.js` utility, which interfaces with the browser's `localStorage`.
*   **No External UI Frameworks**: Do not introduce any new UI frameworks (e.g., React, Vue, Angular, Shadcn/ui, Radix UI) or component libraries. The current architecture is built on native web technologies.
*   **No Build Tools**: Avoid introducing build processes (like Webpack, Vite, Babel) as the current setup is purely client-side.