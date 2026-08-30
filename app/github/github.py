import re
import httpx
from fastapi import HTTPException, status

def parse_github_url(url: str) -> dict:
    """
    Разбирает любые варианты ссылок GitHub:
    - https://github.com/owner/repo/tree/main/CreeperAR
    - https://github.com/owner/repo
    - https://raw.githubusercontent.com/owner/repo/refs/heads/main/CreeperAR/README.md
    """
    clean_url = url.strip().rstrip("/")
    
    # 1. Если передана прямая raw-ссылка
    if "raw.githubusercontent.com" in clean_url:
        pattern = r"raw\.githubusercontent\.com/([^/]+)/([^/]+)/(?:refs/heads/)?([^/]+)/(.*)"
        match = re.search(pattern, clean_url)
        if match:
            owner, repo, branch, subpath = match.groups()
            subpath = re.sub(r"/README\.md$", "", subpath, flags=re.IGNORECASE)
            return {"owner": owner, "repo": repo, "branch": branch, "subpath": subpath}

    # 2. Стандартная ссылка github.com
    pattern = r"github\.com/([^/]+)/([^/]+)(?:/tree/([^/]+)/(.*))?"
    match = re.search(pattern, clean_url)
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некорректная ссылка на GitHub"
        )
        
    owner = match.group(1)
    repo = match.group(2).removesuffix(".git")
    branch = match.group(3) or "main"
    subpath = match.group(4) or ""
    
    subpath = re.sub(r"/README\.md$", "", subpath, flags=re.IGNORECASE)
    
    return {
        "owner": owner,
        "repo": repo,
        "branch": branch,
        "subpath": subpath
    }


async def fetch_readme_content(github_url: str) -> str:
    parsed = parse_github_url(github_url)
    owner = parsed["owner"]
    repo = parsed["repo"]
    branch = parsed["branch"]
    subpath = parsed["subpath"]
    
    headers = {"User-Agent": "WorkshopSharingHubApp"}
    
    # Варианты URL для проверки (с refs/heads/ и без)
    candidate_urls = []
    if subpath:
        candidate_urls.append(f"https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/{branch}/{subpath}/README.md")
        candidate_urls.append(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{subpath}/README.md")
    else:
        candidate_urls.append(f"https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/{branch}/README.md")
        candidate_urls.append(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md")

    # 1. Загрузка через raw URL
    async with httpx.AsyncClient() as client:
        for url in candidate_urls:
            response = await client.get(url, headers=headers, follow_redirects=True)
            content_type = response.headers.get("content-type", "")
            if response.status_code == 200 and "text/html" not in content_type:
                return response.text

    # 2. Запасной вариант через GitHub Contents API
    path = f"{subpath}/README.md" if subpath else "README.md"
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}"
    api_headers = {**headers, "Accept": "application/vnd.github.raw+json"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url, headers=api_headers, follow_redirects=True)
        content_type = response.headers.get("content-type", "")
        if response.status_code == 200 and "text/html" not in content_type:
            return response.text

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="README.md не найден по указанному пути"
    )