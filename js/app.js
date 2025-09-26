(function (app) {
    'use strict';
    app.portfolioProjects = [];
    app.currentProject = {};

    app.homepage = function () {
        setCopyrightYear();
        wireContactForm();
    }

    app.portfolio = async function () {
        setCopyrightYear();
        await loadProjectsData();
        updateNavItems();
        updatePortfolioData();
    }

    app.workItem = async function () {
        setCopyrightYear();
        await loadProjectsData();
        updateNavItems();
        loadCurrentProject();
        updatePageData();
    }

    function setCopyrightYear() {
        const year = new Date().getFullYear();
        const spanYear = document.getElementById('copyright-year');
        spanYear.innerText = year;
    }

    function wireContactForm() {
        const contactForm = document.getElementById('contact-form');
        contactForm.addEventListener('submit', contactFormSubmit);
    }

    function contactFormSubmit(e) {
        e.preventDefault()

        const form = document.getElementById('contact-form');
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');

        const mailTo = `mailto:${email.value}?subject=Contact From ${name.value}&body=${message.value}`

        window.open(mailTo);

        name.value = '';
        email.value = '';
        message.value = '';
    }

    async function loadProjectsData() {
        const cacheData = sessionStorage.getItem('projects');

        if (cacheData !== null) {
            app.portfolioProjects = JSON.parse(cacheData);
        } else {
            const rawData = await fetch('sitedata.json');
            const data = await rawData.json();
            app.portfolioProjects = data;
            sessionStorage.setItem('projects', JSON.stringify(data));
        }
    }

    function loadCurrentProject() {
        const params = new URLSearchParams(window.location.search);
        let item = Number.parseInt(params.get('item'));

        if (item > app.portfolioProjects.length || item < 1) {
            item = 1;
        }

        app.currentProject = app.portfolioProjects[item - 1];
        app.currentProject.id = item;
    }

    function updatePageData() {
        const h2 = document.getElementById('work-item-header');
        h2.innerText = `0${app.currentProject.id}. ${app.currentProject.title}`;

        const img = document.getElementById('work-item-img');
        img.src = app.currentProject.largeImage;
        img.alt = app.currentProject.largeImageAlt;
        img.sizes = app.currentProject.largeImageSizes;
        img.srcset = app.currentProject.largeImageSrcset;
        img.width = app.currentProject.largeImageWidth;
        img.height = app.currentProject.largeImageHeight;

        const projectP = document.querySelector('#project-text>p');
        projectP.innerText = app.currentProject.projectText;

        const challengesP = document.querySelector('#challenges-text>p');
        challengesP.innerText = app.currentProject.challengesText;

        const ul = document.querySelector('#technologies-text>ul');
        const fragment = new DocumentFragment();
        app.currentProject.technologies.forEach((t) => {
            const li = document.createElement('li');
            li.innerText = t;
            fragment.appendChild(li);
        });
        ul.textContent = '';
        ul.appendChild(fragment);
    }

    function updatePortfolioData() {
        const fragment = document.createDocumentFragment();
        let isInverted = false;
        let id = 1;

        for (const project of app.portfolioProjects) {
            const projDiv = createProjectSection(project, id);

            id++;

            if (isInverted) {
                projDiv.classList.add('invert');
            }

            isInverted = !isInverted;

            fragment.append(projDiv);
        }

        const main = document.querySelector('main');
        main.textContent = '';
        main.append(fragment);
    }

    function createProjectSection(data, id) {
        const output = document.createElement('div');

        const h2 = document.createElement('h2');
        h2.innerHTML = `0${id}. ${data.title.replaceAll(' ', '<br>')}`;

        const a = document.createElement('a');
        a.href = `workitem.html?item=${id}`;

        a.innerText = 'see more';
        id++;

        const div = document.createElement('div');
        div.append(h2, a);

        output.append(div);

        const img = document.createElement('img');
        img.src = data.smallImage;
        img.alt = data.smallImageAlt;
        img.width = data.smallImageWidth;
        img.height = data.smallImageHeight;
        output.append(img);

        output.classList.add('highlight');

        return output;
    }

    function updateNavItems() {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < app.portfolioProjects.length; i++) {
            const a = document.createElement('a');
            a.innerText = `Item #${i + 1}`;
            a.href = `workitem.html?item=${i + 1}`;

            const li = document.createElement('li');
            li.appendChild(a);

            fragment.appendChild(li);
        }

        const ul = document.getElementById('nav-menu');
        ul.appendChild(fragment);
    }
})(window.app = window.app || {});