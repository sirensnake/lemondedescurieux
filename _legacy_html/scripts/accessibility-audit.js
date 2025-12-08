// scripts/accessibility-audit.js
class AccessibilityAuditor {
    runAudit() {
        const results = {
            contrast: this.checkContrastRatios(),
            aria: this.checkARIAAttributes(),
            keyboard: this.checkKeyboardNavigation(),
            semantics: this.checkSemanticHTML()
        };
        
        console.table(results);
        return results;
    }

    checkContrastRatios() {
        // Analyse automatique des contrastes
        const elements = document.querySelectorAll('button, a, .text-content');
        const failures = [];
        
        elements.forEach(el => {
            const ratio = this.calculateContrastRatio(el);
            if (ratio < 4.5) {
                failures.push({
                    element: el.tagName,
                    text: el.textContent.substring(0, 30),
                    ratio: ratio.toFixed(2)
                });
            }
        });
        
        return { passed: failures.length === 0, failures };
    }
}

// Exécution dans la console développeur
const auditor = new AccessibilityAuditor();
auditor.runAudit();