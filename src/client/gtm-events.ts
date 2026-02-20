export default function () {
    if (typeof window !== 'undefined') {
        document.addEventListener('click', (e) => {
            // Type assertion for DOM element since Event.target is EventTarget
            const target = e.target as HTMLElement;
            if (!target || !target.closest) return;

            const trackElement = target.closest('[data-track]');
            if (trackElement) {
                const action = trackElement.getAttribute('data-track');
                const category = trackElement.getAttribute('data-track-category') || 'engagement';
                const label = trackElement.getAttribute('data-track-label') || '';

                // Use any since gtag is a global injected by the plugin
                if (typeof (window as any).gtag !== 'undefined') {
                    (window as any).gtag('event', action, {
                        'event_category': category,
                        'event_label': label
                    });
                }
            }
        });
    }
}
