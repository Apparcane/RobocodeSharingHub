import pytest
from httpx import AsyncClient

async def test_create_workshop_unauthorized(client: AsyncClient):
    response = await client.post(
        "/workshops/",
        json={
            "title": "Unauthenticated Test",
            "description": "Should fail",
            "age_category": "10-14",
            "github_url": "test"
        }
    )
    assert response.status_code == 401

async def test_create_workspace_success(client: AsyncClient):
    user_data = {
        "username": "testuser",
        "email": "test@test.ua",
        "password": "testpassword"
    }
    reg_response = await client.post("/auth/register", json=user_data)
    assert reg_response.status_code in (200, 201)

    login_response = await client.request(
        "GET",
        "/auth/login",
        data={
            "username": user_data["email"], 
            "password": user_data["password"]},
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    workshop_payload = {
        "title": "Test",
		"description": "Test workshop",
		"age_category": "10-15",
		"github_url": "test"
    }

    create_response = await client.post("/workshops/", json=workshop_payload, headers=headers)
    
    assert create_response.status_code == 201
    data = create_response.json()
    assert data["title"] == workshop_payload["title"]
    assert "author_id" in data
    assert data["author_id"] is not None