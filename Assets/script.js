let workspaceCount = 0;

function createParticles() {
    const particles = document.getElementById('particles');
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = (Math.random() * 15) + 's';
        p.style.animationDuration = (15 + Math.random() * 10) + 's';
        particles.appendChild(p);
    }
}

function addWorkspace() {
    workspaceCount++;
    const container = document.getElementById('workspaces');
    const ws = document.createElement('div');
    ws.className = 'workspace';
    ws.style.opacity = '0';
    ws.style.transform = 'translateY(30px) scale(0.95)';
    ws.innerHTML = `
        <input type="text" class="editable-title" value="choose your poem name" placeholder="Enter your title...">
        <textarea placeholder="Let your creativity flow..."></textarea>
        <div class="button-group">
            <button class="save-btn" onclick="savePoem(this)">Save as Text</button>
            <button class="toggle-reference" onclick="toggleReference(this)">Reference Media</button>
            <button class="delete-btn" onclick="deleteWorkspace(this)" title="Delete this workspace">Delete</button>
        </div>
        <div class="reference-section hidden">
            <div class="reference-header">
                <h3>Reference Media</h3>
                <button class="change-image-btn" onclick="uploadBackground(this.closest('.reference-section').querySelector('.reference-image'))">Change Media</button>
            </div>
            <div class="reference-image" id="reference${workspaceCount}">
                <span class="reference-text">Click to upload inspiration image or video</span>
            </div>
        </div>
    `;
    container.appendChild(ws);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ws.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            ws.style.opacity = '1';
            ws.style.transform = 'translateY(0) scale(1)';
        });
    });

    setTimeout(() => {
        ws.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const titleInput = ws.querySelector('.editable-title');
        titleInput.focus();
        titleInput.select();
    }, 350);

    // Attach focus/blur effect to dynamically created inputs
    ws.querySelectorAll('input[type="text"], textarea').forEach(attachFocusEffect);

    setupMediaHandlers(ws.querySelector('.reference-image'));

    // Flash the add button
    const addBtn = document.querySelector('.add-workspace-btn');
    if (addBtn) {
        const orig = addBtn.textContent;
        addBtn.textContent = '✓ Added';
        addBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
            addBtn.textContent = orig;
            addBtn.style.background = '';
        }, 1000);
    }
}

function deleteWorkspace(button) {
    const workspace = button.closest('.workspace');
    const title = workspace.querySelector('.editable-title').value || 'Untitled';
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
        workspace.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        workspace.style.transform = 'translateX(-100%) scale(0.8)';
        workspace.style.opacity = '0';
        workspace.style.maxHeight = workspace.offsetHeight + 'px';
        requestAnimationFrame(() => {
            workspace.style.maxHeight = '0px';
            workspace.style.marginBottom = '0';
            workspace.style.padding = '0';
        });
        setTimeout(() => {
            workspace.remove();
            if (document.querySelectorAll('.workspace').length === 0) {
                setTimeout(addWorkspace, 200);
            }
        }, 420);
    }
}

function setupMediaHandlers(container) {
    let scale = 1, isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let media = null;

    function updateTransform() {
        if (media) media.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    function resetTransform() {
        scale = 1; translateX = 0; translateY = 0;
        updateTransform();
    }
    function onWheel(e) {
        if (!media) return;
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const prevScale = scale;
        scale = Math.max(0.5, Math.min(5, scale * (e.deltaY < 0 ? 1.1 : 0.9)));
        translateX -= (e.clientX - rect.left - translateX) * (scale / prevScale - 1);
        translateY -= (e.clientY - rect.top  - translateY) * (scale / prevScale - 1);
        updateTransform();
    }
    function onPointerDown(e) {
        if (!media || e.button !== 0) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        media.style.cursor = 'grabbing';
        e.currentTarget.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e) {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    }
    function onPointerUp() {
        isDragging = false;
        if (media) media.style.cursor = 'grab';
    }
    function setupVideoControls(video) {
        const old = container.querySelector('.video-controls');
        if (old) old.remove();
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        const progress = document.createElement('div');
        progress.className = 'video-progress';
        const bar = document.createElement('div');
        bar.className = 'video-progress-bar';
        progress.appendChild(bar);
        controls.appendChild(progress);
        container.appendChild(controls);
        video.addEventListener('timeupdate', () => {
            if (video.duration) bar.style.width = (video.currentTime / video.duration * 100) + '%';
        });
        progress.addEventListener('click', e => {
            const r = progress.getBoundingClientRect();
            video.currentTime = ((e.clientX - r.left) / r.width) * video.duration;
        });
    }
    function attachHandlers(newMedia) {
        media = newMedia;
        resetTransform();
        media.style.cursor = 'grab';
        // Use addEventListener per-container so multiple workspaces don't clobber each other
        container.addEventListener('wheel', onWheel, { passive: false });
        media.addEventListener('pointerdown', onPointerDown);
        media.addEventListener('pointermove', onPointerMove);
        media.addEventListener('pointerup', onPointerUp);
        media.addEventListener('pointercancel', onPointerUp);
    }
    container.addEventListener('click', function(e) {
        if (!container.querySelector('img') && !container.querySelector('video')) {
            uploadBackground(container);
        }
    });
    return { attachHandlers, setupVideoControls, resetTransform };
}

function savePoem(button) {
    const workspace = button.closest('.workspace');
    const text = workspace.querySelector('textarea').value;
    const title = workspace.querySelector('.editable-title').value.trim() || 'Untitled';
    button.style.transform = 'scale(0.95)';
    button.textContent = 'Saving...';
    setTimeout(() => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        button.textContent = 'Saved!';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
            button.textContent = 'Save as Text';
            button.style.background = '';
            button.style.transform = '';
        }, 2000);
    }, 500);
}

async function lookupWord() {
    const word = document.getElementById('lookupInput').value.trim();
    const resultDiv = document.getElementById('lookupResult');
    if (!word) return;
    resultDiv.innerHTML = '<div class="loading">Searching...</div>';
    try {
        let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        let data = await res.json();
        let suggestionHtml = '';
        if (!Array.isArray(data)) {
            const sugRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&max=1`);
            const suggestions = await sugRes.json();
            if (suggestions.length > 0) {
                const closest = suggestions[0].word;
                suggestionHtml = `<p class="result-suggestion">Did you mean <strong style="color:var(--text-accent)">${closest}</strong>?</p>`;
                res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(closest)}`);
                data = await res.json();
            }
        }
        if (!Array.isArray(data)) {
            resultDiv.innerHTML = '<p class="result-error">Unable to find definition. Try another word.</p>';
            return;
        }
        // Gather all synonyms across all meanings
        const allSynonyms = [];
        data[0].meanings.forEach(m => {
            m.synonyms && allSynonyms.push(...m.synonyms);
            m.definitions.forEach(d => d.synonyms && allSynonyms.push(...d.synonyms));
        });
        const uniqueSynonyms = [...new Set(allSynonyms)];
        const meaning = data[0].meanings[0];
        const definition = meaning.definitions[0].definition;
        resultDiv.innerHTML = suggestionHtml + `
            <div class="result-block">
                <p class="result-word">${data[0].word}</p>
                <p><span class="result-label">Definition:</span></p>
                <p class="result-text">${definition}</p>
                <p><span class="result-label">Synonyms:</span></p>
                <p class="result-text">${uniqueSynonyms.length > 0 ? uniqueSynonyms.slice(0, 10).join(', ') : 'None found'}</p>
            </div>
        `;
    } catch (e) {
        resultDiv.innerHTML = '<p class="result-error">Unable to find definition. Try another word.</p>';
    }
}

async function findRhymes() {
    const word = document.getElementById('rhymeInput').value.trim();
    const resultDiv = document.getElementById('rhymeResult');
    if (!word) return;
    resultDiv.innerHTML = '<div class="loading">Finding rhymes...</div>';
    try {
        let res = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}`);
        let data = await res.json();
        let suggestionHtml = '';
        if (data.length === 0) {
            const sugRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&max=1`);
            const suggestions = await sugRes.json();
            if (suggestions.length > 0) {
                const closest = suggestions[0].word;
                suggestionHtml = `<p class="result-suggestion">Did you mean <strong style="color:var(--text-accent)">${closest}</strong>?</p>`;
                res = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(closest)}`);
                data = await res.json();
            }
        }
        if (data.length === 0) {
            resultDiv.innerHTML = suggestionHtml + '<p class="result-error">No rhymes found. Try a different word.</p>';
            return;
        }
        const pills = data.slice(0, 20).map(item => `<span class="rhyme-pill">${item.word}</span>`).join('');
        resultDiv.innerHTML = suggestionHtml + `
            <div class="result-block">
                <p class="result-word">Rhymes for "${word}":</p>
                <div>${pills}</div>
            </div>
        `;
    } catch (e) {
        resultDiv.innerHTML = '<p class="result-error">Unable to find rhymes. Please try again.</p>';
    }
}

function uploadBackground(element) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = e => changeBackground(e, element);
    input.click();
}

function changeBackground(event, element) {
    const file = event.target.files[0];
    if (!file) return;
    const handlers = setupMediaHandlers(element);
    element.innerHTML = '<div class="loading">Loading media...</div>';
    const reader = new FileReader();
    reader.onload = function(e) {
        element.innerHTML = '';
        handlers.resetTransform();
        if (file.type.startsWith('image/')) {
            element.classList.add('has-image');
            element.classList.remove('has-video');
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = () => {
                element.appendChild(img);
                handlers.attachHandlers(img);
                element.style.borderStyle = 'solid';
                element.style.borderColor = 'var(--text-accent)';
            };
        } else if (file.type.startsWith('video/')) {
            element.classList.add('has-video');
            element.classList.remove('has-image');
            const video = document.createElement('video');
            video.src = e.target.result;
            video.autoplay = true; video.loop = true; video.muted = true;
            video.playsInline = true; video.controls = true;
            video.onloadeddata = () => {
                element.appendChild(video);
                handlers.attachHandlers(video);
                handlers.setupVideoControls(video);
                element.style.borderStyle = 'solid';
                element.style.borderColor = 'var(--text-accent)';
            };
        }
    };
    reader.readAsDataURL(file);
}

function toggleReference(button) {
    const refSection = button.closest('.workspace').querySelector('.reference-section');
    const isNowHidden = refSection.classList.toggle('hidden');
    button.textContent = isNowHidden ? 'Reference Media' : 'Hide Reference';
    button.style.background = isNowHidden ? '' : 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)';
    if (!isNowHidden) {
        refSection.style.marginTop = '2rem';
        refSection.style.padding = '2rem';
    }
}

function attachFocusEffect(input) {
    input.addEventListener('focus', function() {
        if (this.parentElement) this.parentElement.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', function() {
        if (this.parentElement) this.parentElement.style.transform = '';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    addWorkspace();

    // Typewriter welcome placeholder — runs after first workspace is in DOM
    setTimeout(() => {
        const firstTextarea = document.querySelector('textarea');
        if (firstTextarea && !firstTextarea.value) {
            const text = 'Let your emotions go wild...';
            let i = 0;
            function type() {
                if (i < text.length && !firstTextarea.value) {
                    firstTextarea.placeholder = text.substring(0, i + 1);
                    i++;
                    setTimeout(type, 55);
                }
            }
            type();
        }
    }, 800);

    // Attach focus effect to sidebar inputs
    document.querySelectorAll('.sidebar input[type="text"]').forEach(attachFocusEffect);

    // Enter key triggers search in sidebars
    document.getElementById('lookupInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') lookupWord();
    });
    document.getElementById('rhymeInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') findRhymes();
    });

    // Ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
    document.head.appendChild(rippleStyle);

    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const btn = e.target;
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top:  ${e.clientY - rect.top  - size / 2}px;
                background: rgba(255,255,255,0.25);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });

    // Auto-grow textareas
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'TEXTAREA') {
            e.target.style.height = 'auto';
            e.target.style.height = Math.max(300, e.target.scrollHeight) + 'px';
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const ta = document.activeElement;
            if (ta && ta.tagName === 'TEXTAREA') {
                ta.closest('.workspace')?.querySelector('.save-btn')?.click();
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            addWorkspace();
        }
        if (e.key === 'Escape') {
            document.getElementById('lookupInput')?.focus();
        }
    });
});
