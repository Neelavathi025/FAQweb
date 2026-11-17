const defaultFAQs = [
    {
        question: "How can I download my semester timetable?",
        answer: "Log in to the student portal and visit the Academics section to download your semester timetable."
    },
    {
        question: "How can I check my attendance?",
        answer: "You can check your subject-wise attendance through the college student portal."
    },
    {
        question: "What should I do if I lose my college ID card?",
        answer: "Report the loss to the college administration office and request a replacement ID card."
    },
    {
        question: "How can I register for examinations?",
        answer: "Complete the examination registration process through the student portal before the announced deadline."
    },
    {
        question: "Where can I find study materials?",
        answer: "Study materials are available through the college LMS or can be obtained from the respective subject faculty."
    },
    {
        question: "How can I contact my faculty?",
        answer: "You can contact your faculty through the official college email or visit the department during working hours."
    },
    {
        question: "What happens if my attendance is low?",
        answer: "Contact your class teacher or academic coordinator to understand the attendance requirements and available options."
    },
    {
        question: "How can I apply for a bonafide certificate?",
        answer: "Submit a bonafide certificate request to the college administration office."
    }
];

let faqs;

try {
    const saved = localStorage.getItem("campusFAQs");
    faqs = saved ? JSON.parse(saved) : defaultFAQs;
    if (!Array.isArray(faqs)) faqs = defaultFAQs;
} catch {
    faqs = defaultFAQs;
}

const faqList = document.getElementById("faqList");
const searchInput = document.getElementById("searchInput");
const faqForm = document.getElementById("faqForm");
const statusMessage = document.getElementById("statusMessage");
const emptyMessage = document.getElementById("emptyMessage");

function renderFAQs() {
    const search = searchInput.value.trim().toLowerCase();

    faqList.replaceChildren();

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(search)
    );

    emptyMessage.hidden = filteredFAQs.length > 0;

    filteredFAQs.forEach(faq => {
        const item = document.createElement("div");
        item.className = "faq-item";

        const question = document.createElement("button");
        question.className = "faq-question";
        question.type = "button";
        question.setAttribute("aria-expanded", "false");

        const questionText = document.createElement("span");
        questionText.textContent = faq.question;

        const arrow = document.createElement("span");
        arrow.textContent = "+";

        const answer = document.createElement("div");
        answer.className = "faq-answer";
        answer.hidden = true;
        answer.textContent = faq.answer;

        question.append(questionText, arrow);

        question.addEventListener("click", () => {
            const isOpen = !answer.hidden;
            answer.hidden = isOpen;
            question.setAttribute("aria-expanded", String(!isOpen));
            arrow.textContent = isOpen ? "+" : "−";
        });

        item.append(question, answer);
        faqList.appendChild(item);
    });
}

searchInput.addEventListener("input", renderFAQs);

faqForm.addEventListener("submit", event => {
    event.preventDefault();

    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer").value.trim();

    if (!question || !answer) return;

    const exists = faqs.some(faq =>
        faq.question.toLowerCase() === question.toLowerCase()
    );

    if (exists) {
        statusMessage.textContent = "This question already exists.";
        statusMessage.style.color = "#b42318";
        return;
    }

    faqs.push({ question, answer });

    try {
        localStorage.setItem("campusFAQs", JSON.stringify(faqs));
    } catch {
        faqs.pop();
        statusMessage.textContent = "Could not save the FAQ in this browser.";
        statusMessage.style.color = "#b42318";
        return;
    }

    faqForm.reset();
    searchInput.value = "";
    renderFAQs();

    statusMessage.textContent = "FAQ added successfully!";
    statusMessage.style.color = "#28794b";

    document.getElementById("faq-section").scrollIntoView({
        behavior: "smooth"
    });
});

renderFAQs();