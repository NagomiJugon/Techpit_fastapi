from fastapi import APIRouter


router = APIRouter()


@router.get("/routines")
async def list_routines():
    pass


@router.post("/routines")
async def create_routine():
    pass


@router.put("/routines/{routine_id}")
async def update_routine():
    pass


@router.delete("/routines/{routine_id}")
async def delete_routine():
    pass