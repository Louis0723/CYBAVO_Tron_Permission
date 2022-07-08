import AddressWeight from './AddressWeight.js'
import { useState, useMemo } from "react"
/* eslint-disable  react-hooks/exhaustive-deps */

const p = [{ name: "AccountCreateContract", id: 0, checked: false, }, { name: "TransferContract", id: 1, checked: false, }, { name: "TransferAssetContract", id: 2, checked: false, }, { name: "VoteAssetContract", id: 3, checked: false, }, { name: "VoteWitnessContract", id: 4, checked: false, }, { name: "WitnessCreateContract", id: 5, checked: false, }, { name: "AssetIssueContract", id: 6, checked: false, }, { name: "WitnessUpdateContract", id: 8, checked: false, }, { name: "ParticipateAssetIssueContract", id: 9, checked: false, }, { name: "AccountUpdateContract", id: 10, checked: false, }, { name: "FreezeBalanceContract", id: 11, checked: false, }, { name: "UnfreezeBalanceContract", id: 12, checked: false, }, { name: "WithdrawBalanceContract", id: 13, checked: false, }, { name: "UnfreezeAssetContract", id: 14, checked: false, }, { name: "UpdateAssetContract", id: 15, checked: false, }, { name: "ProposalCreateContract", id: 16, checked: false, }, { name: "ProposalApproveContract", id: 17, checked: false, }, { name: "ProposalDeleteContract", id: 18, checked: false, }, { name: "SetAccountIdContract", id: 19, checked: false, }, { name: "CustomContract", id: 20, checked: false, }, { name: "CreateSmartContract", id: 30, checked: false, }, { name: "TriggerSmartContract", id: 31, checked: false, }, { name: "GetContract", id: 32, checked: false, }, { name: "UpdateSettingContract", id: 33, checked: false, }, { name: "ExchangeCreateContract", id: 41, checked: false, }, { name: "ExchangeInjectContract", id: 42, checked: false, }, { name: "ExchangeWithdrawContract", id: 43, checked: false, }, { name: "ExchangeTransactionContract", id: 44, checked: false, }, { name: "UpdateEnergyLimitContract", id: 45, checked: false, }, { name: "AccountPermissionUpdateContract", id: 46, checked: false, }, { name: "ClearABIContract", id: 48, checked: false, }, { name: "UpdateBrokerageContract", id: 49, checked: false, }]

function Active(props) {
    const [active, setActive] = useState({ type: 2 })
    const [permission, setPermission] = useState(JSON.parse(JSON.stringify(p)))
    const [all, setAll] = useState(false)

    const permissionLabel = permission.map((v, index) => {
        return (
            <label className='block' key={index}>
                <input type="checkbox" className="rounded" checked={v.checked}
                    onChange={() => {
                        permission[index].checked = !permission[index].checked
                        setPermission([...permission])
                    }}
                />
                {v.name}
            </label>
        )
    })

    const operations = useMemo(() => {
        const operations = [0, 0, 0, 0, 0, 0, 0, 0]
        permission.forEach(v => {
            if (v.checked) {
                operations[Math.floor(v.id / 8)] |= (1 << v.id % 8)
            }
        })
        const result = operations.map(c => c.toString(16).padStart(2, '0')).join('').padEnd(64, '0')
        setActive({ ...active, ...{ operations: result } })
        return result
    }, [permission])

    useMemo(() => {
        props.callback(active)
    }, [active])
    return (
        <div className='inline-block bg-amber-50 shadow-xl ring-1 ring-gray-900/5  sm:p-10 sm:m-5'>
            <AddressWeight typeName='active' count={1} callback={(address, threshold) => {
                active.keys = address
                setActive({ ...active, threshold })
            }}></AddressWeight>
            <div>
                <label className='block'>
                    operations
                    <input type="text" className="rounded-full" value={operations} placeholder='select permission' disabled />
                </label>
                <label className='block'><input type="checkbox" className="rounded" checked={all} onChange={(e) => {
                    setAll(e.target.checked)
                    permission.forEach((v) => v.checked = e.target.checked)
                    setPermission([...permission])
                }} />All</label>

                {permissionLabel}
            </div>
        </div>
    )
}

export default Active