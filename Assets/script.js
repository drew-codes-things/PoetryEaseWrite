let workspaceCount = 0;
function createParticles() {
    const particles = document.getElementById('particles');
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particles.appendChild(particle);
    }
}
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + 1,
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1
                );
            }
        }
    }
    return dp[m][n];
}
function findClosestMatch(word, wordList) {
    let closest = '';
    let minDistance = Infinity;
    for (const dictWord of wordList) {
        const distance = levenshteinDistance(word.toLowerCase(), dictWord.toLowerCase());
        if (distance < minDistance) {
            minDistance = distance;
            closest = dictWord;
        }
    }
    return minDistance <= 2 ? closest : null;
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
        <textarea placeholder="Let your creativity flow... Write your poetry here..."></textarea>
        <div class="button-group">
            <button class="save-btn" onclick="savePoem(this)">Save as Text</button>
            <button class="toggle-reference" onclick="toggleReference(this)">Reference Media</button>
            <button class="delete-btn" onclick="deleteWorkspace(this)" title="Delete this workspace">Delete</button>
        </div>
        <div class="reference-section hidden">
            <div class="reference-header">
                <h3>Reference Media</h3>
                <button class="change-image-btn" onclick="uploadBackground(document.getElementById('reference${workspaceCount}'))">Change Media</button>
            </div>
            <div class="reference-image" id="reference${workspaceCount}">
                <span class="reference-text">Click to upload inspiration image or video</span>
            </div>
        </div>
    `;
    container.appendChild(ws);
    setTimeout(() => {
        ws.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        ws.style.opacity = '1';
        ws.style.transform = 'translateY(0) scale(1)';
        setTimeout(() => {
            ws.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            const titleInput = ws.querySelector('.editable-title');
            titleInput.focus();
            titleInput.select();
        }, 300);
    }, 100);
    setupMediaHandlers(ws.querySelector('.reference-image'));
    const addBtn = document.querySelector('.add-workspace-btn');
    if (addBtn) {
        const originalContent = addBtn.innerHTML;
        addBtn.innerHTML = '✓';
        addBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
            addBtn.innerHTML = originalContent;
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
        workspace.style.maxHeight = '0px';
        workspace.style.marginBottom = '0';
        workspace.style.padding = '0';
        setTimeout(() => {
            workspace.remove();
            if (document.querySelectorAll('.workspace').length === 0) {
                setTimeout(addWorkspace, 200);
            }
        }, 400);
    }
}
function setupMediaHandlers(container) {
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let media = null;
    function updateTransform() {
        if (media) {
            media.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
    }
    function resetTransform() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }
    function onWheel(e) {
        if (!media) return;
        e.preventDefault();
        const rect = media.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const prevScale = scale;
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        scale = Math.max(0.5, Math.min(5, scale * delta));
        translateX -= (offsetX - translateX) * (scale / prevScale - 1);
        translateY -= (offsetY - translateY) * (scale / prevScale - 1);
        updateTransform();
    }
    function onPointerDown(e) {
        if (!media) return;
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        container.classList.add('panning');
        if (media) media.style.cursor = 'grabbing';
    }
    function onPointerMove(e) {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    }
    function onPointerUp(e) {
        isDragging = false;
        container.classList.remove('panning');
        if (media) media.style.cursor = 'grab';
    }
    function setupVideoControls(video) {
        const oldControls = container.querySelector('.video-controls');
        if (oldControls) oldControls.remove();
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        const progress = document.createElement('div');
        progress.className = 'video-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'video-progress-bar';
        progress.appendChild(progressBar);
        controls.appendChild(progress);
        container.appendChild(controls);
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const percent = (video.currentTime / video.duration) * 100;
                progressBar.style.width = percent + '%';
            }
        });
        progress.addEventListener('click', (e) => {
            const rect = progress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });
    }
    container.onwheel = null;
    container.onpointerdown = null;
    container.onpointermove = null;
    container.onpointerup = null;
    window.onpointerup = null;
    function attachHandlers(newMedia) {
        media = newMedia;
        resetTransform();
        media.style.cursor = 'grab';
        container.onwheel = onWheel;
        media.onpointerdown = onPointerDown;
        window.onpointermove = onPointerMove;
        window.onpointerup = onPointerUp;
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
    const filename = `${title}.txt`;
    button.style.transform = 'scale(0.95)';
    button.innerHTML = 'Saving...';
    setTimeout(() => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        button.innerHTML = 'Saved!';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
            button.innerHTML = 'Save as Text';
            button.style.background = '';
            button.style.transform = '';
        }, 2000);
    }, 500);
}
async function lookupWord() {
    const word = document.getElementById('lookupInput').value.trim();
    const resultDiv = document.getElementById('lookupResult');
    if (!word) return;
    resultDiv.innerHTML = '<div class="loading">🔍 Searching...</div>';
    try {
        let res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        let data = await res.json();
        if (data.title === "No Definitions Found") {
            const suggestionRes = await fetch(`https://api.datamuse.com/words?sp=${word}`);
            const suggestions = await suggestionRes.json();
            if (suggestions.length > 0) {
                const closestWord = suggestions[0].word;
                resultDiv.innerHTML = `Did you mean "<strong style="color: var(--text-accent)">${closestWord}</strong>"?<br><br>`;
                res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${closestWord}`);
                data = await res.json();
            }
        }
        const meaning = data[0].meanings[0];
        const definition = meaning.definitions[0].definition;
        const synonyms = meaning.synonyms && meaning.synonyms.length > 0 ? meaning.synonyms.join(", ") : "None found";
        resultDiv.innerHTML += `
            <div style="border-left: 3px solid var(--text-accent); padding-left: 1rem;">
                <strong style="color: var(--text-accent); font-size: 1.1rem;">${data[0].word}</strong><br><br>
                <strong>Definition:</strong> ${definition}<br><br>
                <strong>Synonyms:</strong> ${synonyms}
            </div>
        `;
    } catch (e) {
        resultDiv.innerHTML = `<div style="color: #ff6b6b;">Unable to find definition. Try another word.</div>`;
    }
}
async function findRhymes() {
    const word = document.getElementById('rhymeInput').value.trim();
    const resultDiv = document.getElementById('rhymeResult');
    if (!word) return;
    resultDiv.innerHTML = '<div class="loading">Finding rhymes...</div>';
    try {
        let res = await fetch(`https://api.datamuse.com/words?rel_rhy=${word}`);
        let data = await res.json();
        if (data.length === 0) {
            const suggestionRes = await fetch(`https://api.datamuse.com/words?sp=${word}`);
            const suggestions = await suggestionRes.json();
            if (suggestions.length > 0) {
                const closestWord = suggestions[0].word;
                resultDiv.innerHTML = `Did you mean "<strong style="color: var(--text-accent)">${closestWord}</strong>"?<br><br>`;
                res = await fetch(`https://api.datamuse.com/words?rel_rhy=${closestWord}`);
                data = await res.json();
            }
        }
        if (data.length > 0) {
            const rhymes = data.slice(0, 20).map(item => 
                `<span style="display: inline-block; background: rgba(100, 255, 218, 0.1); 
                padding: 0.2rem 0.5rem; margin: 0.2rem; border-radius: 6px; 
                border: 1px solid rgba(100, 255, 218, 0.2);">${item.word}</span>`
            ).join('');
            resultDiv.innerHTML += `
                <div style="border-left: 3px solid var(--text-accent); padding-left: 1rem;">
                    <strong style="color: var(--text-accent); font-size: 1.1rem;">Rhymes for "${word}":</strong><br><br>
                    ${rhymes}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div style="color: #ff6b6b;">No rhymes found. Try a different word.</div>`;
        }
    } catch (e) {
        resultDiv.innerHTML = `<div style="color: #ff6b6b;">Unable to find rhymes. Please try again.</div>`;
    }
}
function uploadBackground(element) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.style.display = 'none';
    input.onchange = (event) => changeBackground(event, element);
    input.click();
}
function changeBackground(event, element) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const handlers = setupMediaHandlers(element);
    element.innerHTML = '<div class="loading" style="color: var(--text-accent);">Loading media...</div>';
    reader.onload = function(e) {
        element.innerHTML = '';
        element.classList.add('has-image');
        element.classList.remove('has-video');
        handlers.resetTransform();
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.transform = 'scale(1)';
            img.onload = () => {
                element.appendChild(img);
                handlers.attachHandlers(img);
                element.style.borderStyle = 'solid';
                element.style.borderColor = 'var(--text-accent)';
            };
        } else if (file.type.startsWith('video/')) {
            element.classList.add('has-video');
            const video = document.createElement('video');
            video.src = e.target.result;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.controls = true;
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
    const isHiding = !refSection.classList.contains('hidden');
    refSection.classList.toggle('hidden');
    if (isHiding) {
        button.innerHTML = 'Show Reference';
        button.style.background = 'rgba(255, 255, 255, 0.1)';
    } else {
        button.innerHTML = 'Hide Reference';
        button.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)';
        refSection.style.marginTop = '2rem';
        refSection.style.padding = '2rem';
    }
}
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeTextarea = document.activeElement;
        if (activeTextarea && activeTextarea.tagName === 'TEXTAREA') {
            const workspace = activeTextarea.closest('.workspace');
            if (workspace) {
                const saveBtn = workspace.querySelector('.save-btn');
                saveBtn.click();
            }
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addWorkspace();
    }
    if (e.key === 'Escape') {
        const lookupInput = document.getElementById('lookupInput');
        if (lookupInput) lookupInput.focus();
    }
});
setTimeout(() => {
    const firstTextarea = document.querySelector('textarea');
    if (firstTextarea && !firstTextarea.value) {
        const welcomeText = "Let your emotions go wild<3";
        let index = 0;
        function typeWriter() {
            if (index < welcomeText.length && !firstTextarea.value) {
                firstTextarea.placeholder = welcomeText.substring(0, index + 1);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }
}, 1000);
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const ripple = document.createElement('span');
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            if (!document.querySelector('style[data-ripple]')) {
                const style = document.createElement('style');
                style.setAttribute('data-ripple', '');
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            e.target.style.position = 'relative';
            e.target.style.overflow = 'hidden';
            e.target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) this.parentElement.style.transform = 'scale(1.02)';
        });
        input.addEventListener('blur', function() {
            if (this.parentElement) this.parentElement.style.transform = '';
        });
    });
});
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = Math.max(300, e.target.scrollHeight) + 'px';
    }
});
createParticles();
addWorkspace();
