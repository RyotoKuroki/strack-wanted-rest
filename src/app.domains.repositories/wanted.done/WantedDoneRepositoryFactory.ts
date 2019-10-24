import IWantedDoneRepository from "./I.Wanted.Done.Repository";
import { WantedDoneRepository } from "./Wanted.Done.Repository";
import { AbsRepositoryFactory } from "../Abs.Repository.Factory";
import DataStore from "../../app.infras/infra.datastores/DataStore";

export class WantedDoneRepositoryFactory extends AbsRepositoryFactory<WantedDoneRepository> {

    public /* override */ async CreateRepository(): Promise<any/* Repository */> {
        return await new WantedDoneRepository();
    }
    public /* override */ async CreateDataStore(repo: WantedDoneRepository): Promise<DataStore> {
        return await repo.CreateDataStore();
    }
    public /* override */ async CreateNestedRepository(repo: WantedDoneRepository, datastore: DataStore): Promise<any/* Repository */> {
        return await repo.CreateNestedRepository(datastore);
    }
}
