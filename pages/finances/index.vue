<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Finances</h1>
        <p class="text-sm text-slate-500 mt-1">Manage your revenue, payouts, and financial reports.</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
        <DownloadIcon class="w-4 h-4" />
        Download Report
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ArrowUpRightIcon class="w-5 h-5 text-emerald-600" />
          </div>
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Income</span>
        </div>
        <div class="text-3xl font-bold text-slate-900">₦2,450,000</div>
        <div class="mt-2 text-sm font-medium text-emerald-600">+14% from last month</div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <WalletIcon class="w-5 h-5 text-blue-600" />
          </div>
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Available Balance</span>
        </div>
        <div class="text-3xl font-bold text-slate-900">₦1,250,500</div>
        <button class="mt-4 w-full bg-slate-900 text-white font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
          Request Payout
        </button>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <CreditCardIcon class="w-5 h-5 text-purple-600" />
          </div>
          <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</span>
        </div>
        <div class="text-3xl font-bold text-slate-900">₦340,000</div>
        <div class="mt-2 text-sm font-medium text-purple-600">Platform Fees & Refunds</div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 class="font-bold text-slate-800">Recent Transactions</h2>
      </div>
      <div class="p-8 text-center text-slate-500">
        <BanknoteIcon class="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p class="text-lg font-medium text-slate-700">No recent transactions</p>
        <p class="text-sm mt-1">Your payout history and transactions will appear here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DownloadIcon, ArrowUpRightIcon, WalletIcon, CreditCardIcon, BanknoteIcon } from 'lucide-vue-next';
</script>
