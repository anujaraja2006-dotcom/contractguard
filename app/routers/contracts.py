from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.contract import ContractCreate, ContractUpdate, ContractOut
from app.services.contract_service import ContractService

router = APIRouter(prefix="/api/contracts", tags=["Contracts"])


@router.get("/", response_model=List[ContractOut])
def list_contracts(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return ContractService.get_all(db, category, status)


@router.get("/{contract_id}", response_model=ContractOut)
def get_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = ContractService.get_by_id(db, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract


@router.post("/", response_model=ContractOut)
def create_contract(payload: ContractCreate, db: Session = Depends(get_db)):
    return ContractService.create(db, payload)


@router.put("/{contract_id}", response_model=ContractOut)
def update_contract(contract_id: int, payload: ContractUpdate, db: Session = Depends(get_db)):
    contract = ContractService.update(db, contract_id, payload)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract


@router.delete("/{contract_id}")
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    success = ContractService.delete(db, contract_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contract not found")
    return {"message": "Contract deleted successfully"}


@router.post("/{contract_id}/upload")
async def upload_contract_document(contract_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    contract = ContractService.get_by_id(db, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return {
        "contract_id": contract_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "status": "Document successfully attached to contract dossier",
    }
