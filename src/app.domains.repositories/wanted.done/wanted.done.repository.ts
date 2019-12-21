import $ from 'jquery';
import { AbsRepository } from '../Abs.repository';
import IWantedDoneRepository from './I.wanted.done.repository';
import DataStore from '../../app.infras/datastores/datastore.mysql';
import { TrWanted, PatchSpecifyKeys } from '../../app.entities/tr.wanted';
import { DoneStates } from 'strack-wanted-meta/dist/consts/states/states.done';

export class WantedDoneRepository extends AbsRepository implements IWantedDoneRepository {

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@ override AbsWantedDoneRepository @@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    /**
     * StoredWanted 情報のコピーを外部に提供する。
     * Wanted インスタンスを外部に直接晒さないのは、外部から不正な参照方法で編集されることを防ぐための対策。
     */
    public get StoredWanted(): TrWanted {
        // TODO: エラー回避＆コメント解除
        // return $.extend(true, {}, this._Wanted);
        return this._Wanted;
    }
    protected _Wanted!: TrWanted;

    /**
     * DB検索。
     * Wanted情報を特定して、１件取得
     * @param specifyKeys 
     */
    public /* override */ async StoreWanted(specifyKeys: PatchSpecifyKeys): Promise<any> {
        const conditions = { whois: specifyKeys.whois, uuid: specifyKeys.uuid, revision: specifyKeys.revision };
        const temp = await TrWanted.findOne({ where: conditions });
        this._DataStore.ThrowErrorNotFoundSpecifyKeysInfo(temp, conditions);
        this._Wanted = temp!;
        return this;
    }

    /**
     * Done情報を更新
     * @param specifyKeys 
     * @param done 
     */
    public /* override */ async ChangeDoneState(done: boolean): Promise<any> {
        this._Wanted.done = done ? DoneStates.DONE : DoneStates.YET;
        return this;
    }

    /**
     * Done情報を更新
     * @param specifyKeys 
     * @param done 
     */
    public /* override */ async Update(): Promise<any> {
        const revisionOld = this._Wanted.revision;
        this._Wanted.revision += 1;
        const affectedRows = await this._DataStore.Update(TrWanted, this._Wanted, {
            uuid: this._Wanted.uuid,
            revision: revisionOld,
        });
        this._DataStore.ThrowErrorNotExpectedAffectedRowsCount(affectedRows, 1);
        this.StoreWanted(new PatchSpecifyKeys(this._Wanted.uuid, this._Wanted.revision, this._Wanted.whois));
        return this;
    }



    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@ override AbsRepository @@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    protected _DataStore!: DataStore;
    /** DataStore生成 */
    public /* override */ async CreateDataStore(): Promise<any /* Repository */> {
        this._DataStore = await new DataStore();
        await this._DataStore.Init([TrWanted]);
        return this;
    }

    /* 外部からこのリポジトリにDataStoreを設定する場合に実装 */
    public /* override */ async SetDataStore(datastore: DataStore): Promise<any /* Repository */> {
        this._DataStore = datastore;
        return this;
    }

    /** リポジトリがネストした際、このリポジトリを特定するためのハッシュコード作成 */
    public /* override */ async CreateNestedRepository(datastore: DataStore): Promise<any /* Repository */> {
        // 今は不要
        // throw new Error(`CreateNestedRepository not implements exception.`);
        return this;
    }
    
    /** トランザクション管理実施 */
    public /* override */ async Run(fnc: (result: any) => void): Promise<any /* Repository */> {
        return await this._DataStore.Run(async (result: any) => {
            return await fnc(result);
        });
    }
    
    /** トランザクション管理実施 */
    public /* override */ async RunWithTran(fnc: (result: any) => void): Promise<any /* Repository */> {
        return await this._DataStore.RunWithTransaction(async (result: any) => {
            return await fnc(result);
        });
    }
}
