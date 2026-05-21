import { Wallet, WalletType } from '@/app/core/models/wallet.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-wallet',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './wallet-list.component.html',
    styleUrls: ['./wallet-list.component.css', '../../../shared/styles/section.css']
})
export class WalletListComponent {
    Wallets: Wallet[] = [{
        uuid: '1lmfda90sdas0',
        name: 'Nubank',
        currentBalance: 1500.00,
        description: 'Minha carteira principal para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH,
        color: '#8c00ff'
    }, {
        uuid: '12mo3km12o3m12o3',
        name: 'Carteira Secundária',
        currentBalance: 2500.00,
        description: 'Minha carteira secundária para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH
    }, {
        uuid: '1okenm12o3nm1o2l',
        name: 'Carteira Terciária',
        currentBalance: 3000.00,
        description: 'Minha carteira terciária para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH
    }, {
        uuid: '1okenm12o3nm1o2l',
        name: 'Carteira Terciária',
        currentBalance: 3000.00,
        description: 'Minha carteira terciária para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH
    },  {
        uuid: '1okenm12o3nm1o2l',
        name: 'Carteira Terciária',
        currentBalance: 3000.00,
        description: 'Minha carteira terciária para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH
    },  {
        uuid: '1okenm12o3nm1o2l',
        name: 'Carteira Terciária',
        currentBalance: 3000.00,
        description: 'Minha carteira terciária para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH
    },  {
        uuid: '1okenm12o3nm1o2l',
        name: 'Carteira Terciária',
        currentBalance: 3000.00,
        description: 'Minha carteira terciária para despesas diárias',
        userUuid: 'user-uuid-123',
        type: WalletType.CASH
    }];
}
