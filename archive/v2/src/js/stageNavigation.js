export function setupStageNavigation() {
    const stages = ['stage-intake', 'stage-claims', 'stage-adjudication'];
    let currentStageIndex = 1; // Start at the second stage (index 1)

    const updateStageVisibility = () => {
        stages.forEach((stageId, index) => {
            const stageElement = document.getElementById(stageId);
            if (stageElement) {
                stageElement.classList.toggle('hide', index !== currentStageIndex);
            }
        });

        // Update Work Items visibility based on the current stage
        if (currentStageIndex === 2) { // Stage 3: Adjudication
            document.getElementById('wi-adjudication')?.classList.remove('hide'); // Show Adjudication item
            document.getElementById('wi-claims-prep-in-progress')?.classList.add('hide'); // Hide Claims Prep In Progress
            document.getElementById('wi-claims-prep-complete')?.classList.remove('hide'); // Show Claims Prep Complete
        } else if (currentStageIndex === 1) { // Stage 2: Claims Preparation
            document.getElementById('wi-adjudication')?.classList.add('hide'); // Hide Adjudication item
            document.getElementById('wi-claims-prep-in-progress')?.classList.remove('hide'); // Show Claims Prep In Progress
            document.getElementById('wi-claims-prep-complete')?.classList.add('hide'); // Hide Claims Prep Complete
        } else if (currentStageIndex === 0) { // Stage 1: Intake
            document.getElementById('wi-adjudication')?.classList.add('hide'); // Hide Adjudication item
            document.getElementById('wi-claims-prep-in-progress')?.classList.add('hide'); // Hide Claims Prep In Progress
            document.getElementById('wi-claims-prep-complete')?.classList.add('hide'); // Hide Claims Prep Complete
        }
    };

    // Event listeners for navigation buttons
    document.getElementById('next-to-claims')?.addEventListener('click', () => {
        if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            updateStageVisibility();
        }
    });

    document.getElementById('prev-to-intake')?.addEventListener('click', () => {
        if (currentStageIndex > 0) {
            currentStageIndex--;
            updateStageVisibility();
        }
    });

    document.getElementById('next-to-adjudication')?.addEventListener('click', () => {
        if (currentStageIndex < stages.length - 1) {
            currentStageIndex++;
            updateStageVisibility();
        }
    });

    document.getElementById('prev-to-claims')?.addEventListener('click', () => {
        if (currentStageIndex > 0) {
            currentStageIndex--;
            updateStageVisibility();
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const button = document.getElementById('next-to-payment');
        const menu = button.querySelector('menu');

        // Toggle 'active' class on button click
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from propagating to document
            menu.classList.toggle('active');
        });

        // Remove 'active' class when clicking elsewhere
        document.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });

    // Initialize visibility
    updateStageVisibility();
}