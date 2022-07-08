import { useMemo } from 'react';
import { useState } from 'react';
import './App.css';
/* eslint-disable  react-hooks/exhaustive-deps */
function Type(props) {
  const typeName = props.typeName
  const [threshold, setThreshold] = useState(1)
  const [addressCount, setAddressCount] = useState(props.count)
  const [typeResult, setTypeResult] = useState([])
  useMemo(() => {
    props.callback(typeResult, threshold)
  }, [typeResult, threshold])
  typeResult.length = addressCount
  const addresses = useMemo(() => {
    const result = []
    for (let i = 0; i < addressCount; i++) {
      result.push(
        <div key={i}>
          <input type="text" className="rounded w-8/12 border-rose-500" placeholder={`${typeName} address`}
            onChange={(e) => {
              typeResult[i] = {
                ...typeResult[i], ...{ address: window.tronWeb.utils.base58.decode58(e.target.value).map(s => s.toString(16).padStart(2, '0')).join('').substr(0, 42) }
              }
              setTypeResult([...typeResult])
            }} />
          <input type="number" className="rounded w-4/12 border-rose-500" placeholder={`${typeName} weight`}
            onChange={(e) => {
              typeResult[i] = {
                ...typeResult[i], ...{ weight: Number(e.target.value) }
              }
              setTypeResult([...typeResult])
            }} />
        </div>
      )
    }
    return result
  }, [addressCount])

  return (
    <div>
      {typeName}
      <input type="number" className="rounded-full"
        value={threshold}
        onChange={(e) => e.target.value > 0 && setThreshold(Number(e.target.value))}
        placeholder={`${typeName} threshold`}
      />
      <div>
        <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
          onClick={() => {
            (addressCount + 1 <= 5) && setAddressCount(addressCount + 1)
          }}
        >+</button>
        <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
          onClick={() => {
            (addressCount - 1 >= 0) && setAddressCount(addressCount - 1)
          }}
        >-</button>
      </div>
      {addresses}
    </div>
  )
}

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
      <Type typeName='active' count={1} callback={(address, threshold) => {
        active.keys = address
        setActive({ ...active, threshold })
      }}></Type>
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
function App() {
  const [ownerAddress, setOwnerAddress] = useState('')
  const [activeCount, setActiveCount] = useState(1)
  const [permissionData, setPermissionData] = useState({ actives: [], owner: { type: 0 }, witness: { type: 1 }, visible: false })
  const actives = []

  for (let i = 0; i < activeCount; i++) {
    actives.push(<Active key={i} callback={(active) => {
      active.permission_name = `active${i}`
      permissionData.actives[i] = active
      permissionData.actives = [...permissionData.actives]
      setPermissionData({ ...permissionData })
    }}></Active>)
  }

  console.log(permissionData)

  return (
    <div className="relative min-h-screen flex flex-col  overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto  sm:rounded-lg sm:px-10">
        <div className="mx-auto ">
          owner address
          <button className="rounded-full px-2 py-2 m-2 bg-green-500 text-white rounded-full shadow-sm"
            onClick={() => {
              setOwnerAddress(window?.window.tronWeb?.defaultAddress?.base58)
            }}
          >Load TronLink</button>
          <input type="text" className="rounded-full w-full" placeholder='owner'
            value={ownerAddress} onChange={(e) => { setOwnerAddress(e.target.value) }} />
          <button className="block rounded-full  px-2 py-2 m-2 bg-red-500 text-white rounded-full shadow-sm"
            onClick={() => {
              const tronWeb = window.tronWeb
              const targetAddress = tronWeb.utils.base58.decode58(ownerAddress).map(s => s.toString(16).padStart(2, '0')).join('').substr(0, 42)
              tronWeb.transactionBuilder.updateAccountPermissions(targetAddress, permissionData.owner, permissionData.witness?.keys?.length || null, permissionData.actives)
                .then(tronWeb.trx.sign).then((raw) => {
                  console.log(raw)
                  return tronWeb.trx.sendRawTransaction(raw)
                }).then(result => {
                  window.open(`https://shasta.tronscan.org/#/transaction/${result.txid}`)
                })
              // tronWeb.trx.sendRawTransaction
            }}
          >update permission</button>
          <Type typeName='owner' count={1} callback={(address, threshold) => {
            setPermissionData({ ...permissionData, ...{ owner: { keys: address, threshold, permission_name: "owner", type: 0 } } })
          }}></Type>
          <Type typeName='witness' count={0} callback={(address, threshold) => {
            setPermissionData({ ...permissionData, ...{ witness: { keys: address, threshold, permission_name: "witness", type: 1 } } })
          }}
          ></Type>
          <div>
            <div>actives</div>
            <div>
              <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                onClick={() => {
                  permissionData.actives.length = activeCount + 1
                  setPermissionData({ ...permissionData })
                    (activeCount + 1 <= 8) && setActiveCount(activeCount + 1)
                }}
              >+</button>
              <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                onClick={() => {
                  permissionData.actives.length = activeCount - 1
                  setPermissionData({ ...permissionData })
                    (activeCount - 1 >= 0) && setActiveCount(activeCount - 1)
                }}
              >-</button>
            </div>
            <div className='flex justify-start items-start'>
              {actives}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
