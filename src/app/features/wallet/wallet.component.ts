import { CommonModule } from '@angular/common';
import { Wallet } from './../../core/models/wallet.model';
import { Component } from '@angular/core';

@Component({
    selector: 'app-wallet',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
})
export class WalletComponent {
    Wallets: Wallet[] = [{
        uuid: '1lmfda90sdas0',
        name: 'Carteira Principal',
        currentBalance: 1500.00,
        description: 'Minha carteira principal para despesas diárias',
        userUuid: 'user-uuid-123'
    }, {
        uuid: '12mo3km12o3m12o3',
        name: 'Carteira Secundária',
        currentBalance: 2500.00,
        description: 'Minha carteira secundária para despesas diárias',
        userUuid: 'user-uuid-123'
    }, {
        uuid: '1okenm12o3nm1o2l',
        name: 'Carteira Terciária',
        currentBalance: 3000.00,
        description: 'Minha carteira terciária para despesas diárias',
        userUuid: 'user-uuid-123'
    }];
}
