import { useState } from 'react';
import './App.css';
import AddressWeight from './AddressWeight.js'
import Active from './Active.js'
/* eslint-disable  react-hooks/exhaustive-deps */



function App() {
  const [txData, setTxData] = useState('')
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
          <button className="rounded-full px-2 py-2 m-2 bg-blue-500 text-white rounded-full shadow-sm"
            onClick={() => {
              const tronWeb = window.tronWeb
              const targetAddress = tronWeb.utils.base58.decode58(ownerAddress).map(s => s.toString(16).padStart(2, '0')).join('').substr(0, 42)
              tronWeb.transactionBuilder.updateAccountPermissions(targetAddress, permissionData.owner, permissionData.witness?.keys?.length || null, permissionData.actives)
                .then((txData) => {
                  return tronWeb.transactionBuilder.extendExpiration(txData , 600)
                }).then((txData) => {
                  setTxData(JSON.stringify(txData, null, 2))
                })
            }}
          >update permission</button>
          <button className="rounded-full px-2 py-2 m-2 bg-blue-500 text-white rounded-full shadow-sm"
            onClick={() => {
              const tronWeb = window.tronWeb
              tronWeb.trx.sign(JSON.parse(txData)).then((txData)=>{
                return tronWeb.trx.sendRawTransaction(txData)
              })
                .then(result => {
                  window.open(`https://shasta.tronscan.org/#/transaction/${result.txid}`)
                })
            }}
          >summit</button>
          <textarea className='rounded w-full' value={txData} disabled placeholder='tx data json' rows={5} />
          <AddressWeight typeName='owner' count={1} callback={(address, threshold) => {
            setPermissionData({ ...permissionData, ...{ owner: { keys: address, threshold, permission_name: "owner", type: 0 } } })
          }}></AddressWeight>
          <AddressWeight typeName='witness' count={0} callback={(address, threshold) => {
            setPermissionData({ ...permissionData, ...{ witness: { keys: address, threshold, permission_name: "witness", type: 1 } } })
          }}
          ></AddressWeight>
          <div>
            <div>actives</div>
            <div>
              <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                onClick={() => {
                  permissionData.actives.length = activeCount + 1
                  setPermissionData({ ...permissionData })
                  if (activeCount + 1 <= 8) setActiveCount(activeCount + 1)
                }}
              >+</button>
              <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                onClick={() => {
                  permissionData.actives.length = activeCount - 1
                  setPermissionData({ ...permissionData })
                  if (activeCount - 1 > 0) setActiveCount(activeCount - 1)
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
